var socket = io.connect(window.location.origin);

socket.on('connect', function(){
    console.log('Connected');
    socket.emit('add_player', {'name': 'hello'});
});

socket.on('debug', function(data) {
    console.log('Received event debug with data: ', data);
});

