//a chaque chargement de page, on verifie si l'utilisateur est connecté
if(!window.location.href.includes("game.html") || !window.location.href.includes("gameOnline.html")) {
    window.onload = function () {
        if (getUsername() !== null) {
            document.getElementById("se-connecter").style.display = "none";
            document.getElementById("se-deconnecter").style.display = "flex";
            document.getElementsByClassName("name")[0].innerHTML = getUsername();
            document.getElementsByClassName("name")[0].style.cursor = "pointer";
            document.getElementsByClassName("name")[0].style.textOverflow = "ellipsis";
            document.getElementsByClassName("name")[0].style.overflow = "hidden";

            document.getElementById("petitePhoto").style.cursor = "pointer";
            //rendre sombre un peu quand hover
            document.getElementById("petitePhoto").onmouseover = function () {
                document.getElementById("petitePhoto").style.filter = "brightness(80%)";
            }
            //rendre normal quand hover out
            document.getElementById("petitePhoto").onmouseout = function () {
                document.getElementById("petitePhoto").style.filter = "brightness(100%)";
            }

            //make bold when hover
            document.getElementsByClassName("name")[0].onmouseover = function () {
                document.getElementsByClassName("name")[0].style.fontWeight = "bold";
            }
            //make normal when hover out
            document.getElementsByClassName("name")[0].onmouseout = function () {
                document.getElementsByClassName("name")[0].style.fontWeight = "normal";
            }
        }
        if (getUsername() == null) {
            document.getElementById("se-connecter").style.display = "flex";
            document.getElementById("se-deconnecter").style.display = "none";
            document.getElementsByClassName("name")[0].innerHTML = "Invité";
            document.getElementsByClassName("name")[0].style.cursor = "pointer";
            //make bold when hover
            document.getElementsByClassName("name")[0].onmouseover = function () {
                document.getElementsByClassName("name")[0].style.fontWeight = "bold";
            }
            //make normal when hover out
            document.getElementsByClassName("name")[0].onmouseout = function () {
                document.getElementsByClassName("name")[0].style.fontWeight = "normal";
            }
        }
    }
}

//recuperer cookie username
function getUsername(){
    let username =getCookie("username");
    if(username !== undefined){
        return username;
    }

    return null;
}