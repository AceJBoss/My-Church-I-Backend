var socket = io.connect('/');
socket.on('announcements', function(data) {
    console.log('Got announcement:', data.message);
});

socket.emit('test', {message: 'Hey, I have an important message!'})