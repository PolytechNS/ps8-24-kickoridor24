const socket = io('/api/game');


socket.emit('joinGame');
socket.on('joinedGame', (room) => {
    console.log('joinedGame');
    console.log(room);
});

socket.on('startGame', (message) => {
    console.log(message);
});


function redirectToMenu() {
    window.location.href = "play-page.html";
}
