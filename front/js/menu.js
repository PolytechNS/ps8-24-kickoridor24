
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

async function openAmiChat() {
    document.getElementsByClassName("matchMsg")[0].style.display = "none";
    document.getElementsByClassName("amisMsg")[0].style.display = "none";
    document.getElementsByClassName("chatAmiMsg")[0].style.display = "flex";
    document.getElementsByClassName("inputEcrire")[0].style.display = "flex";


    //charger les messages de la conversation dans la base de donnée
    var username = getCookie("username");
    var ami = document.getElementById("nomAmiID").textContent;
    const formDataJSON = {};
    formDataJSON["username"] = username;
    formDataJSON["ami"] = ami;

    const response = await fetch('/api/getMessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJSON)
    }).then(response => response.json())
        .then(data => {
            var chat = document.getElementById("chatAmiID");
            chat.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                var div = document.createElement("div");
                if (data[i].username === username) {
                    div.classList.add("mesMsg");
                    var p = document.createElement("p");
                    p.classList.add("msgMoi");
                    p.textContent = data[i].message;
                    div.appendChild(p);
                } else {
                    div.classList.add("autreMsg");
                    var p = document.createElement("p");
                    p.classList.add("msgAutre");
                    p.textContent = data[i].message;
                    div.appendChild(p);
                }
                chat.appendChild(div);
            }
        });

    scrollToBott();
}
function redirectToFriendsPage() {
    window.location.href = "friends-page.html";

}

function showAmisChat(){
    document.getElementsByClassName("amisMsg")[0].style.display = "flex";
    document.getElementsByClassName("matchMsg")[0].style.display = "none";
    document.getElementsByClassName("chatAmiMsg")[0].style.display = "none";
    document.getElementsByClassName("inputEcrire")[0].style.display = "none";
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
        alert(e.message);
    }
}
if(window.location.href !== "friends-page.html")
checkFriends();