const socket = io('/api/game');


socket.emit('joinGame');
socket.on('joinedGame', (room) => {
    console.log('joinedGame');
    console.log(room);
});

socket.on('startGame', (room) => {
    setCookie("typeDePartie", "online", 1);
    setCookie("room", room, 1);
    window.location.href = "game.html?room=" + room;
});

socket.on('firstPlayer', () => {
    console.log('firstPlayer');
    setCookie("player", "1", 1);
});


function redirectToMenu() {
    window.location.href = "play-page.html";
}
