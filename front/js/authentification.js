//a chaque chargement de page, on verifie si l'utilisateur est connecté
if(!window.location.href.includes("game.html")) {
    window.onload = function () {
        if (getUsername() !== null) {
            document.getElementById("se-connecter").style.display = "none";
            document.getElementById("se-deconnecter").style.display = "block";
            document.getElementsByClassName("name")[0].innerHTML = getUsername();
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
        if (getUsername() == null) {
            document.getElementById("se-connecter").style.display = "block";
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