const socket = io('/api/game');


socket.emit('joinGame');
socket.on('joinedGame', (room) => {
    console.log('joinedGame');
    console.log(room);
});

socket.on('startGame', (room) => {
    window.location.href = "game.html?room=" + room;
});


function redirectToMenu() {
    window.location.href = "play-page.html";
}
