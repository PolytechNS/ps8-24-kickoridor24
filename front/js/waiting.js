
setCookie("player", "0", -1);

socket.emit('joinGame');
socket.on('joinedGame', (room) => {
    console.log(room);
    setCookie("option","",1);

});

socket.on('startGame', (room) => {
    setCookie("typeDePartie", "enLigne", 1);
    setCookie("room", room, 1);
    if(!getCookie("player") == "1"){
        console.log("ok");
        setCookie("player", "2", 1);
    }
    console.log(getCookie("username"));
    console.log(getCookie("player"));
    socket.emit("changePage");
    window.location.href = "gameOnline.html?room=" + room;
});

socket.on('firstPlayer', () => {
    console.log('firstPlayer');
    setCookie("player", "1", 1);
});


function redirectToMenu() {
    socket.emit('quitRoom');
    setCookie('typeDePartie','',-1);
    window.location.href = "play-page.html";
}