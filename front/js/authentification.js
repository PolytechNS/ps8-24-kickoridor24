//a chaque chargement de page, on verifie si l'utilisateur est connecté
window.onload = function(){
    if(getUsername() !== null){
        document.getElementById("se-connecter").style.display = "none";
        document.getElementById("se-deconnecter").style.display = "block";
        document.getElementsByClassName("name")[0].innerHTML = getUsername();
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