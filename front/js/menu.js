function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        // Ajoute 7 jours à la date actuelle
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";

}

function redirectToGame(name, value, days) {
    setCookie(name,value,days);
    window.location.href = "game.html";
}

function redirectToLogin() {
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    window.location.href = "login.html";
}

function redirectToMenu() {
    window.location.href = "index.html";
}