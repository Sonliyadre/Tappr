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

//@TODO When game ends, don't forget to regenrate the gameId
var gameId  = generateUniqueGameId();

var players = [];

app.use(express.static('public', options));


app.post('/admin/login', function (req, res) {
    var isAuthenticated = false;
    if (req.body.username == CONFIG.credentials.username && req.body.password == CONFIG.credentials.password) {
        isAuthenticated = true;
    }
    
    res.send({"authentication": isAuthenticated});
}); 

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/public/admin/index.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/player/index.html');
});

io.on('connection', function(socket) {

    console.log('Socket Connected', socket.id);
    socket.emit('debug', {'test': 'server'});
    
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
    
    socket.on('add_player', function(data) {
        var isAlreadyInList = false;
        for (var index in players) {
            if (players[index].name == data.name) {
                isAlreadyInList = true;
                console.log(players.name + " already exists");
                break;
            }
        }
        
        if (isAlreadyInList) {
             socket.emit('add_player', {'addition': false, 'message': 'Already in list'});
        } else {
            players.push({name: data.name, socket_id: this.id});
            socket.join(gameId);
            socket.emit('add_player', {'addition': true, 'message': ''});
        }
    });
    
    // socket.on('check_login', function(data) {
        
    //     if (data.username == 'Sonia') {
    //         console.log('OK!')
    //     } else {
    //         console.log('Imposter!!')
    //     }
        
        
    //     if (data.password == password) {
    //         console.log("OK!")
    //     } else {
    //         console.log('Incorrect password, try again Sonia!')
    //     }
    // })
        
    
    // console.log(socket);   
    /*
    socket.on('ping', function(socket) {
        console.log('Sending Event To Socket ' + socket.id);
        socket.emit('pong', {});
    });
    
    socket.on('channel-ping', function(socket) {
        console.log('Sending Event To All Sockets Joined Subscribed To Channel');
        socket.to('channelName').emit('channel-pong', {});
    });
    
    socket.on('broadcast-ping', function(socket) {
        console.log('Broadcastying Accross All Sockets');
        io.emit('broadcast-pong', {});
    });

    // Example : Socket Joins a Channel
    socket.join('channelName');
    socket.emit('connect-event', { some: 'data' });*/
});

http.listen(CONFIG.environment.port);

// Helper Functions //

function generateUniqueGameId() {
    return 'game' + new Date().getTime();
}
