function redirectToGame() {
    window.location.href = "game.html";
}

function redirectToLogin() {
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    window.location.href = "login.html";
}

function redirectToMenu() {
    window.location.href = "index.html";
}