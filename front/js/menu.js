
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

function redirectToFriendsPage() {
    window.location.href = "friends-page.html";
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


function showFriendsList(){
    document.getElementsByClassName("friendsList")[0].style.display = "flex";
    document.getElementsByClassName("friendsAdd")[0].style.display = "none";
    document.getElementsByClassName("friendsDemands")[0].style.display = "none";
    document.getElementById("amisBTN").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("ajouterBTN").style.borderBottom = "none";
    document.getElementById("ajouterBTN").style.backgroundColor = "#E4E5E7";
    document.getElementById("demandesBTN").style.borderBottom = "none";
    document.getElementById("demandesBTN").style.backgroundColor = "#E4E5E7";
    document.getElementById("amisBTN").style.backgroundColor = "#3EE4F0";
}

function showFriendsAdd(){
    document.getElementsByClassName("friendsAdd")[0].style.display = "flex";
    document.getElementsByClassName("friendsList")[0].style.display = "none";
    document.getElementsByClassName("friendsDemands")[0].style.display = "none";
    document.getElementById("ajouterBTN").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("amisBTN").style.borderBottom = "none";
    document.getElementById("amisBTN").style.backgroundColor = "#E4E5E7";
    document.getElementById("demandesBTN").style.borderBottom = "none";
    document.getElementById("demandesBTN").style.backgroundColor = "#E4E5E7";
    document.getElementById("ajouterBTN").style.backgroundColor = "#3EE4F0";
}

function showFriendsDemands(){
    document.getElementsByClassName("friendsDemands")[0].style.display = "flex";
    document.getElementsByClassName("friendsList")[0].style.display = "none";
    document.getElementsByClassName("friendsAdd")[0].style.display = "none";
    document.getElementById("demandesBTN").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("amisBTN").style.borderBottom = "none";
    document.getElementById("amisBTN").style.backgroundColor = "#E4E5E7";
    document.getElementById("ajouterBTN").style.borderBottom = "none";
    document.getElementById("ajouterBTN").style.backgroundColor = "#E4E5E7";
    document.getElementById("demandesBTN").style.backgroundColor = "#3EE4F0";
}

async function checkFriends(){

    if(getCookie("username") == null){
        var amisDiv =   document.getElementById("amisDiv");
      amisDiv.style.display = 'none';


        return ;
    }else{
        console.log("okkkk");
        var amisDiv =   document.getElementById("amisDiv");
        amisDiv.style.display = 'flex';


    }

    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    try {
        const response = await fetch('/api/askFriendsList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau ou HTTP: ' + response.status);
            }

            return response.json(); // Convertit la réponse en JSON
        })
            .then(data => {
                var amisDiv =   document.getElementById("amisDiv");
                if(data.length > 0){
                    amisDiv.getElementsByTagName('span')[0].style.display = 'flex';
                }else{
                    amisDiv.getElementsByTagName('span')[0].style.display = 'none';
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des demandes d\'amis : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}
checkFriends();