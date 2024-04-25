

localStorage.removeItem("player");
socket.emit('joinGame');
socket.on('joinedGame', (room) => {
    console.log(room);
    localStorage.setItem("option","");

});
var gamePrete = false;
socket.on('startGame', (room) => {
    localStorage.setItem("typeDePartie", "enLigne");
    localStorage.setItem("room", room);
    if(!localStorage.getItem("player") == "1"){
        console.log("ok");
        localStorage.setItem("player", "2");
    }
  //  console.log(getCookie("username"));
   // console.log(getCookie("player"));
    gamePrete =true;
    socket.emit("changePage");
    window.location.href = "gameOnline.html?room=" + room;
});

socket.on('firstPlayer', () => {
    console.log('firstPlayer');
    localStorage.setItem("player", "1");
});


function redirectToMenu() {
    socket.emit('quitRoom');
    localStorage.removeItem('typeDePartie');
    window.location.href = "play-page.html";
}

window.onbeforeunload = function() {
    if(!gamePrete)
    redirectToMenu();
};