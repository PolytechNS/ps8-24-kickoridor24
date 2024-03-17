
function redirectToGame(name, value, days) {
    setCookie(name,value,days);
    window.location.href = "game.html";
}

function redirectToLogin() {
    setCookie("username","",-1);

    window.location.href = "login.html";
}

function redirectToBotPage() {
    window.location.href = "bot-page.html";
}

function redirectToClassement() {
    window.location.href = "classement-page.html";
}

function redirectToRegle() {
    window.location.href = "regle-page.html";
}

function redirectToPlayPage() {
    window.location.href = "play-page.html";

}

function redirectToMenu() {
    window.location.href = "index.html";
}

function redirectToProfil(){
    window.location.href = "profil.html";

}

function showOnlinePlay(){
    document.getElementsByClassName("onlinePlay")[0].style.display = "flex";
    document.getElementsByClassName("horsLignePlay")[0].style.display = "none";
    document.getElementById("ligne").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("hors").style.borderBottom = "none";
    document.getElementById("hors").style.backgroundColor = "#E4E5E7";
    document.getElementById("ligne").style.backgroundColor = "#3EE4F0";
}

function showHorsLignePlay(){
    document.getElementsByClassName("horsLignePlay")[0].style.display = "flex";
    document.getElementsByClassName("onlinePlay")[0].style.display = "none";
    document.getElementById("hors").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("ligne").style.borderBottom = "none";
    document.getElementById("hors").style.backgroundColor = "#3EE4F0";
    document.getElementById("ligne").style.backgroundColor = "#E4E5E7";
}

function showMatchChat(){
    document.getElementsByClassName("matchMsg")[0].style.display = "flex";
    document.getElementsByClassName("amisMsg")[0].style.display = "none";
    document.getElementsByClassName("chatAmiMsg")[0].style.display = "none";
    document.getElementById("matchChat").style.backgroundColor = "#3EE4F0";
    document.getElementById("amisChat").style.backgroundColor = "#E4E5E7";
    document.getElementById("matchChat").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("amisChat").style.borderBottom = "none";
}

function openChat() {
    var chatMenu = document.getElementById("chatMenu");
    var chat = document.getElementById("chat");

    if (chatMenu.classList.contains("show")) {
        chatMenu.classList.remove("show");
        chat.style.width = "10%";
    } else {
        chatMenu.classList.add("show");
        chat.style.width = "22%";
    }
}

function openAmiChat() {
    document.getElementsByClassName("matchMsg")[0].style.display = "none";
    document.getElementsByClassName("amisMsg")[0].style.display = "none";
    document.getElementsByClassName("chatAmiMsg")[0].style.display = "flex";
}

function showAmisChat(){
    document.getElementsByClassName("amisMsg")[0].style.display = "flex";
    document.getElementsByClassName("matchMsg")[0].style.display = "none";
    document.getElementsByClassName("chatAmiMsg")[0].style.display = "none";
    document.getElementById("amisChat").style.backgroundColor = "#3EE4F0";
    document.getElementById("matchChat").style.backgroundColor = "#E4E5E7";
    document.getElementById("amisChat").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("matchChat").style.borderBottom = "none";
}

function scrollToBott(){
    const element = document.getElementById("chatAmiID");
    element.scrollTop = element.scrollHeight;
}

function scrollToBottMatch(){
    const element = document.getElementById("matchChattID");
    element.scrollTop = element.scrollHeight;
}

async function checkResumegame(){
    var div =  document.getElementById("resumeGameButton");
 if(getCookie("username") != null){
     const formDataJSON = {};
     formDataJSON["username"] = getCookie("username");
     try {
         const response = await fetch('/api/gameRetrieve', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(formDataJSON)
         }).then(response => {
             if (!response.ok) {
               // div.onclick = null;
                 div.style.opacity = 0.5;
                 div.style.backgroundColor = "#ccc"; // Change la couleur de fond en gris clair
                 div.style.pointerEvents = "none";
             }});}catch (e) {

     }
 }else{

     div.style.display = 'none';
 }
}
checkResumegame();