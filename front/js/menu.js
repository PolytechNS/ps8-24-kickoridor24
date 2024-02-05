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