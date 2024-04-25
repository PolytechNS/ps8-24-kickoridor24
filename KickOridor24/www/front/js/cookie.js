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

function getCookie(name){
    if(document.cookie.length == 0)
        return null;

    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);

    for(var i = 0; i < cookies.length; i++){
        var regInfo = new RegExp('=', 'g');
        var infos = cookies[i].split(regInfo);
        if(infos[0] == name){
            return unescape(infos[1]);
        }
    }
    return null;
}

function checkConnection() {
    var networkState = navigator.connection.type;
    if(networkState == "none"){
        setCookie("username","",-1);
    }


    //alert('Connection type: ' + networkState);
}

checkConnection();