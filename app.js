'use strict';

var CONFIG = require(__dirname + '/config');

var express = require('express');
var app     = express();

var bodyParser = require('body-parser');
app.use (bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var http = require('http').createServer(app);
var io = require('socket.io')();
io.listen(http);

var options = {
    dotfiles  : 'ignore',
    etag      : false,
    extensions: ['htm', 'html'],
    index     : 'index.html',
    maxAge    : '1d',
    redirect  : false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

var gameId              = null;
var leaderboardInterval = null;
var game_status         = CONFIG.game.status.STOPPED;

var players         = [];
var admin_socket_id = null;

app.use(express.static('public', options));

app.post('/admin/login', function (req, res) {
    var isAuthenticated = false;
    if (req.body.username == CONFIG.credentials.username && req.body.password == CONFIG.credentials.password) {
        isAuthenticated = true;
        admin_socket_id = '/#' + req.body.socketId;
    }
    
    res.send({"authentication": isAuthenticated});
}); 

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/public/admin/index.html');
});

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/player/index.html');
});

io.on('connection', function(socket) {

    console.log('Socket Connected', socket.id);
    
    socket.on('error', function(data) {
        console.log("Socket Error " + this.id);
    });
    
    socket.on('disconnect', function(data) {
        console.log("Socket Disconnected " + this.id);
        for (var index in players) {
            if (players[index].socket_id == this.id) {
                console.log("Player Removed: " + players[index].name);
                delete players[index];
                break;
            }
        }

    });
    
    socket.on(CONFIG.game.event.PLAYER_ADD, function(data) {
        var isAlreadyInList = false;
        for (var index in players) {
            if (players[index].name == data.name) {
                isAlreadyInList = true;
                break;
            }
        }
        
        if (isAlreadyInList) {
             console.log(data.name + " already exists");
             socket.emit(CONFIG.game.event.PLAYER_ADD, {'addition': false, 'message': 'Already in list'});
        } else {
            console.log(data.name + " was added");
            players.push({name: data.name, socket_id: this.id, tap_count:0, effects: []});
            socket.join(gameId);
            socket.emit(CONFIG.game.event.PLAYER_ADD, {'addition': true, 'message': 'Welcome!'});
        }
    });

    socket.on(CONFIG.game.event.GAME_START_TIMER, function(data) {
        if (admin_socket_id === this.id && game_status === CONFIG.game.status.STOPPED) {
            players     = [];
            game_status = CONFIG.game.status.WAITING;
            gameId      = generateUniqueGameId();
                
            console.log('Starting New Game with Channel ID ' + gameId);
            setTimeout(function() {
                game_status = CONFIG.game.status.STARTED;
                io.to(admin_socket_id).emit(CONFIG.game.event.GAME_START);
                io.to(gameId).emit(CONFIG.game.event.GAME_START);
                leaderboardInterval = setInterval(function() {
                    io.to(admin_socket_id).emit(CONFIG.game.event.PLAYER_DATA, sanitizePlayerData());
                }, CONFIG.game.intervalLeaderboard);
            }, CONFIG.game.intervalTimer);
        }
    
    });
    
    socket.on(CONFIG.game.event.PLAYER_DATA, function(data) {
        socket.emit(CONFIG.game.event.PLAYER_DATA, sanitizePlayerData());
    });

    socket.on(CONFIG.game.event.GAME_STATUS, function(data) {
        socket.emit(CONFIG.game.event.GAME_STATUS, {status: game_status});
    });
    
    socket.on(CONFIG.game.event.PLAYER_CLICK, function(data) {
        if (game_status != CONFIG.game.status.STOPPED) {
            for (var index in players) {
                if (players[index].socket_id == this.id) {

                    var tapIncrement = 0;
                    if (players[index].effects.indexOf('freeze') != -1) {
                    } else if (players[index].effects.indexOf('dbltap') != -1) {
                        tapIncrement = 2;
                    } else {
                        tapIncrement = 1;
                    }  
                    players[index].tap_count = players[index].tap_count + tapIncrement;
                    console.log('Incremented tap count for ' + players[index].name + ' by ' + tapIncrement);
                    
                    // Lasting Effects
                    if (Math.floor(Math.random()*CONFIG.game.effectLastingChance) == 5) {
                        var randomEffect        = getRandomLastingEffect();
                        var randomEffectTimeout = getRandomLastingEffectTimeout();
                        console.log('Sending lasting effect ' + randomEffect + ' to ' + players[index].name);
                        players[index].effects.push(randomEffect);
                        socket.emit(CONFIG.game.event.PLAYER_EFFECT_LASTING, {
                            type:   randomEffect,
                            status: 'active'
                        });
                        io.to(admin_socket_id).emit(CONFIG.game.event.PLAYER_EFFECT_LASTING, { 
                            player: players[index], 
                            type:   randomEffect, 
                            status: 'active'
                        });
                        
                        console.log('Starting effect timeout for ' + randomEffect + ' for ' + players[index]);
                        setTimeout(function() {
                            console.log('Stopping lasting effect for ' + randomEffect + ' for ' + players[index]);
                            
                            var effectIndex = players[index].effects.indexOf(randomEffect);
                            if(effectIndex != -1) {
                                players[index].effects.splice(effectIndex, 1);
                            }
                            socket.emit(CONFIG.game.event.PLAYER_EFFECT_LASTING, {
                                type:   randomEffect, 
                                status: 'inactive'
                            });
                            io.to(admin_socket_id).emit(CONFIG.game.event.PLAYER_EFFECT_LASTING, { 
                                player: players[index], 
                                type:   randomEffect, 
                                status: 'inactive'
                            });
                        }, randomEffectTimeout);
                    }

                    // Instant Effects
                    if (Math.floor(Math.random()*CONFIG.game.effectInstantChance) == 5) {
                        var randomEffect = getRandomInstantEffet();
                        console.log('Sending instant effect ' + randomEffect + ' to ' + players[index].name);
                        switch(randomEffect) {
                            case 'half':
                                tapIncrement = Math.floor(players[index].tap_count / 2);
                                players[index].tap_count = players[index].tap_count - tapIncrement;
                                break;
                            case 'leech':
                                players[index].tap_count = players[index].tap_count - tapIncrement;
                                var randomPlayerIndex = Math.floor(Math.random() * players.length);
                                players[randomPlayerIndex].tap_count = players[randomPlayerIndex].tap_count + tapIncrement;
                                break;
                            case 'plusTen':
                                tapIncrement = 10;
                                players[index].tap_count = players[index].tap_count + tapIncrement;       // NEED TO CHECK THIS
                                break;
                            case 'loseTen':
                                tapIncrement = -10;
                                players[index].tap_count = players[index].tap_count + tapIncrement;       // NEED TO CHECK THIS
                                break;
                            default:
                                break;
                        }
                        socket.emit(CONFIG.game.event.PLAYER_EFFECT_INSTANT, {
                            type:  randomEffect,
                            value: tapIncrement
                        });
                        io.to(admin_socket_id).emit(CONFIG.game.event.PLAYER_EFFECT_INSTANT, { 
                            type:  randomEffect,
                            value: tapIncrement,
                            player: players[index]
                        });
                    }

                    if (players[index].tap_count >= CONFIG.game.maxTap) {
                        console.log('Ending Existing Game with Channel ID ' + gameId);
                        game_status = CONFIG.game.status.STOPPED;
                        clearInterval(leaderboardInterval);
                        io.to(admin_socket_id).emit(CONFIG.game.event.GAME_STOP);
                        socket.to(gameId).emit(CONFIG.game.event.GAME_STOP);
                    }
                    
                    break;
                }
            }
        }
        
    });
        
});

http.listen(CONFIG.environment.port);

// Helper Functions //

function generateUniqueGameId() {
    return 'game' + new Date().getTime();
}

function sanitizePlayerData() {
    return players.filter(function(el) {
        return el.name && el.tap_count;
    });
}

function getRandomLastingEffect() {
    var possibleEffects = ['dbltap', 'freeze'];
    return possibleEffects[Math.floor(Math.random() * possibleEffects.length)];
}

function getRandomInstantEffet() {
    var possibleEffects = ['half', 'leech', 'plusTen', 'loseTen'];
    return possibleEffects[Math.floor(Math.random() * possibleEffects.length)];
}

function getRandomLastingEffectTimeout() {
    return Math.floor(Math.random() + CONFIG.game.effectAdditionTime) + CONFIG.game.effectMinimumTime;
}