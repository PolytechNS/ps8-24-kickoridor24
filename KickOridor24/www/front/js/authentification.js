// Fonction pour vérifier le statut de l'utilisateur et mettre à jour le style en fonction du dispositif
function updateStyle() {
    if (getUsername() !== null) {
        document.getElementById("se-connecter").style.display = "none";
        if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches) {
            document.getElementById("se-deconnecter").style.display = "none";
        } else {
            document.getElementById("se-deconnecter").style.display = "flex";
        }
        document.getElementsByClassName("name")[0].innerHTML = getUsername();
        document.getElementsByClassName("name")[0].style.cursor = "pointer";
        document.getElementsByClassName("name")[0].style.textOverflow = "ellipsis";
        document.getElementsByClassName("name")[0].style.overflow = "hidden";

        document.getElementById("petitePhoto").style.cursor = "pointer";
        document.getElementById("petitePhoto").onmouseover = function () {
            document.getElementById("petitePhoto").style.filter = "brightness(80%)";
        }
        document.getElementById("petitePhoto").onmouseout = function () {
            document.getElementById("petitePhoto").style.filter = "brightness(100%)";
        }
        document.getElementsByClassName("name")[0].onmouseover = function () {
            document.getElementsByClassName("name")[0].style.fontWeight = "bold";
        }
        document.getElementsByClassName("name")[0].onmouseout = function () {
            document.getElementsByClassName("name")[0].style.fontWeight = "normal";
        }
    } else {
        document.getElementById("se-connecter").style.display = "flex";
        document.getElementById("se-deconnecter").style.display = "none";
        document.getElementsByClassName("name")[0].innerHTML = "Invité";
        document.getElementsByClassName("name")[0].style.cursor = "pointer";
document.getElementsByClassName("logoDeco")[0].style.display = "none";
        document.getElementsByClassName("name")[0].onmouseover = function () {
            document.getElementsByClassName("name")[0].style.fontWeight = "bold";
        }
        document.getElementsByClassName("name")[0].onmouseout = function () {
            document.getElementsByClassName("name")[0].style.fontWeight = "normal";
        }
    }
}

// Mettre à jour le style lorsque la page est chargée
window.onload = updateStyle;

// Mettre à jour le style lorsque le dispositif change
window.matchMedia("(max-aspect-ratio: 4/3.1)").addListener(updateStyle);


//recuperer cookie username
function getUsername(){
    let username =getCookie("username");
    if(username !== undefined){
        return username;
    }

    return null;
}