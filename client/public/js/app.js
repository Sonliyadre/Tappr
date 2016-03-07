var socket = io.connect("http://localhost:8888");

socket.on('connect', function(){
    console.log('Connected');
});

socket.on('pong', function(data) {
    console.log('Received event pong with data: ', data);
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});