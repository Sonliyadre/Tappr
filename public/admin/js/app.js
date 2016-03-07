var socket = io.connect(window.location.origin);

socket.on('connect', function(){
    console.log('Connected');
});

socket.on('pong', function(data) {
    console.log('Received event pong with data: ', data);
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});