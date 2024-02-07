function redirectToGame(name, value, days) {
    setCookie(name,value,days);
    window.location.href = "game.html";
}

function redirectToLogin() {
    window.location.href = "login.html";
}

function redirectToMenu() {
    window.location.href = "index.html";
}