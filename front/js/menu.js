var userID;

var photoDeProfil ="images/photoProfil/Mitroglu.png";
var celebrationBDD =null;
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
    document.getElementsByClassName("inputEcrire")[0].style.display = "flex";
    document.getElementById("matchChat").style.backgroundColor = "#3EE4F0";
    document.getElementById("amisChat").style.backgroundColor = "#E4E5E7";
    document.getElementById("matchChat").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("amisChat").style.borderBottom = "none";
}



function redirectToFriendsPage() {
    window.location.href = "friends-page.html";

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
if(window.location.href.includes("play-page.html"))
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
        var amisDiv =   document.getElementById("amisDiv");
        amisDiv.style.display = 'flex';
    }
    const formDataJSON = {};
    var user = getCookie("username");
    formDataJSON["username"] = user;
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
        console.log(error.message);
    }
}
var affichageNotifChat = false;
async function getConversationNotif(){
    if(getCookie("username") == null){
        var chat =   document.getElementById("chat");
        chat.style.display = 'none';


        return ;
    }else{
        var chat =   document.getElementById("chat");
        chat.style.display = 'flex';
    }
    const formDataJSON = {};
    var user = getCookie("username");
    formDataJSON["username"] = user;

    try {
        const response = await fetch('/api/getConversation', {
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
            .then(async data => {
                affichageNotif = false;
                for (var i = 0; i < data.length; i++) {

                    if(data[i]["lastMsg"] != undefined ){
                        const message = await getMessageById(data[i]["lastMsg"]);
                        if(message["lu"] == false && message["emetteur"] !== user) {
                            affichageNotifChat = true;
                            showHideNotif();
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des conversations : ', error);
            });

    } catch (e) {
        console.log(error.message);
    }
}
async function getMessageById(id){
    const formDataJSON = {};
    formDataJSON["idMsg"] = id.toString();

    const response = await fetch('/api/getMsgById', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJSON)
    });
    const data = await response.json();

    // Retourner les données
    return data;

}
function showHideNotif(data){
    var chatbtn =  document.getElementById("chat");
    var notif = chatbtn.getElementsByClassName('notification-badge')[0];
    if(data == "close"){
        notif.style.display = 'none';
    }
    else if(affichageNotifChat) {
        notif.style.display = 'flex';
    }
    else{
        notif.style.display = 'none';

    }
}

if(!window.location.href.includes("friends-page.html") &&!window.location.href.includes("login.html")&&!window.location.href.includes("signup.html") ) {
    notif();
}
async function getId(){
    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    try {
        const response = await fetch('/api/retrieveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la récupération des informations : ' + response.status);
            }

            return response.json(); // Convertit la réponse en JSON
        }).then(data => {
            userID = data["_id"];
            if(photoDeProfil !== data["img"]){
                majPhoto( data["img"]);

            }
            if(celebrationBDD == null){
                celebrationBDD = data["celebration"];
            }
        });


    } catch (error) {
        console.log(error.message);
    }
}

function majPhoto(newImage){
    photoDeProfil =newImage;
    if(!window.location.href.includes("game.html"))
    document.getElementById("petitePhoto").src = photoDeProfil;
}
async function notif() {
    await getId();
    if(!window.location.href.includes("game.html"))
    {
        await checkFriends();
    }
    await getConversationNotif();
}
