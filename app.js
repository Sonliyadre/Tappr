'use strict';

var CONFIG = require(__dirname + '/config');

var express = require('express');
var app     = express();
var http    = require('http').createServer(app);

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

app.use(express.static('public', options));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/player/index.html');
});

app.get('/admin', function (req, res) {
    res.sendfile(__dirname + '/public/admin/index.html');
});

http.listen(CONFIG.environment.port);

io.sockets.on('connection', function(socket){
    console.log('Socket Connected', socket.id);
    
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
    socket.emit('connect-event', { some: 'data' });
});

io.sockets.on('disconnect', function() {
    console.log('Socket Disconnected', this.id);
});