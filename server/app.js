'use strict';

var CONFIG = require(__dirname + '/config');

var app    = require('express')();
var server = require('http').Server(app);
var io     = require('socket.io')(server);

server.listen(CONFIG.environment.port);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    console.log('Socket Connected', socket.id);
    // Example : Socket Joins a Channel
    socket.join('channelName');
    socket.emit('connect-event', { some: 'data' });
});

io.sockets.on('ping', function(socket) {
    console.log('Sending Event To Socket ' + socket.id);
    socket.emit('pong', {});
});

io.sockets.on('channel-ping', function(socket) {
    console.log('Sending Event To All Sockets Joined Subscribed To Channel');
    socket.to('channelName').emit('channel-pong', {});
});

io.sockets.on('broadcast-ping', function(socket) {
    console.log('Broadcastying Accross All Sockets');
    io.emit('broadcast-pong', {});
});

io.sockets.on('disconnect', function() {
    console.log('Socket Disconnected', this.id);
    socket.emit('disconnect-event', { some: 'data' });
});