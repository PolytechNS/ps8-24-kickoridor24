const socket = io("/api/game");
socket.emit('login', getCookie("username"));
var input = document.getElementById("messageInput");

// Ajout d'un écouteur d'événements sur l'événement keydown
input.addEventListener("keydown", function(event) {
    // Vérification si la touche pressée est la touche "Entrée"
    if (event.keyCode === 13) {
        // Le code que vous souhaitez exécuter lorsque la touche "Entrée" est pressée
        envoyerChat();
    }
});

async function envoyerChat(){
    const message = document.getElementById("messageInput").value;
    var username = getCookie("username");
    var ami = document.getElementById("nomAmiID").textContent;

    const formDataJSON = {};
    formDataJSON["message"] = message;
    formDataJSON["username"] = username;
    formDataJSON["ami"] = ami;
    try {
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        })
                document.getElementById('messageInput').value = "";
                //ajoute dans la class chatAmi une div avec la class mesMsg qui contien elle meme un p avec la classe msgMoi et le message en contenu
                var div = document.createElement("div");
                div.classList.add("mesMsg");
                var p = document.createElement("p");
                p.classList.add("msgMoi");
                p.textContent = message;
                div.appendChild(p);
                document.getElementById("chatAmiID").appendChild(div);
                scrollToBott();
                socket.emit('message',{ senderId: username, ami, message });

    } catch (e) {
        alert(e.message);
    }
}

async function getConversation(){

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

                var chatMenu = document.getElementById("chatMenu");
                var amisMsg = chatMenu.getElementsByClassName("amisMsg")[0];

                while(amisMsg.firstChild)
                    amisMsg.removeChild(amisMsg.firstChild);

                if(data.length === 0){
                    var para = document.createElement("p");
                    para.textContent = "Aucun ami trouvé";
                    chatMenu.appendChild(para);
                }else {

                    for (var i = 0; i < data.length; i++) {

                        var div= document.createElement("div");
                        div.classList.add("listeAmis");



                        var divProfil= document.createElement("div");
                        divProfil.style.display ="flex";
                        div.appendChild(divProfil);

                        var username = data[i]["username"];

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        var divImg = document.createElement("div");
                        divImg.classList.add("mitroChat");

                        divImg.appendChild(img);
                        divProfil.appendChild(divImg);
                        div.appendChild(divProfil);

                        var nom = document.createElement("span");
                        nom.classList.add("nom")
                        nom.textContent = username;
                        divProfil.appendChild(nom);

                        var divBouton =  document.createElement("div");
                        divBouton.classList.add("notif-poubelle");
                        var imgChat = document.createElement("img");
                        imgChat.classList.add("notif");
                        imgChat.src = "images/chatMsg.png";

                        if(data[i]["lastMsg"] != undefined ){

                            const message = await getMessageById(data[i]["lastMsg"]);

                            if(message["lu"] == false && message["emetteur"] !== user) {
                                imgChat.src = "images/chat-notif.png";
                              //  showHideNotif("true");
                            }
                        }

                        var dataTMP = data[i];

                        div.addEventListener("click", function() {
                            var dataFNC = dataTMP;

                            return function() {

                                openAmiChat(dataFNC);
                                scrollToBott();
                            };
                        }());

                        divBouton.appendChild(imgChat);
                        div.appendChild(divBouton);
                        amisMsg.appendChild(div);
                    }
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des conversations : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}

async function openAmiChat(data) {

    document.getElementsByClassName("matchMsg")[0].style.display = "none";
    document.getElementsByClassName("amisMsg")[0].style.display = "none";
    document.getElementsByClassName("chatAmiMsg")[0].style.display = "flex";
    document.getElementsByClassName("inputEcrire")[0].style.display = "flex";
    document.getElementById("nomAmiID").textContent = data["username"];


    var photo = document.getElementById("photoChatAvecUnAmis");
    photo.src = data["img"];


    //charger les messages de la conversation dans la base de donnée
    var username = getCookie("username");

    const formDataJSON = {};
    formDataJSON["username"] = username;
    formDataJSON["ami"] =  data["username"];

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
                if (data[i]["emetteur"] === username) {
                    div.classList.add("mesMsg");
                    var p = document.createElement("p");
                    p.classList.add("msgMoi");
                    p.textContent = data[i].message;
                    div.appendChild(p);
                } else {
                    div.classList.add("msgAmis");
                    var p = document.createElement("p");
                    p.classList.add("sesMsg");
                    p.textContent = data[i].message;
                    div.appendChild(p);
                }
                chat.appendChild(div);
            }
        });

    scrollToBott();
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

async function openChat() {

    if(affichageNotifChat) {
        showHideNotif("close");
    }
    var chatMenu = document.getElementById("chatMenu");
    var chat = document.getElementById("chat");

    if (chatMenu.classList.contains("show")) {
        chatMenu.classList.remove("show");
        chat.style.width = "10%";
        getConversationNotif();
    } else {
        chatMenu.classList.add("show");
        chat.style.width = "22%";
        getConversation();
    }
}






socket.on('newMessage', async (data) => {
    const { senderId, message } = data;
    var chatMenu = document.getElementById("chatMenu");
    var amisMsg = chatMenu.getElementsByClassName("amisMsg")[0];
   var chatAmisMsg = document.getElementsByClassName("chatAmiMsg")[0];

 if(!chatMenu.classList.contains("show")){
     await getConversationNotif();
    }else if (amisMsg.style.display == 'flex'){
       await getConversation();
    }
    else if(chatAmisMsg.style.display == 'flex'){

       var amiTXT =  document.getElementById("nomAmiID").textContent;
       if(amiTXT == senderId){
           await updateMessage(data);
       }else{
           await getConversation();
       }
   }


});

async function updateMessage(data){
    var username = getCookie("username");

    const formDataJSON = {};
    formDataJSON["username"] = username;
    formDataJSON["ami"] =  data["senderId"];

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

                if (data[i]["emetteur"] === userID) {
                    div.classList.add("mesMsg");
                    var p = document.createElement("p");
                    p.classList.add("msgMoi");
                    p.textContent = data[i].message;
                    div.appendChild(p);
                } else {
                    div.classList.add("msgAmis");
                    var p = document.createElement("p");
                    p.classList.add("sesMsg");
                    p.textContent = data[i].message;
                    div.appendChild(p);
                }
                chat.appendChild(div);
            }
        });

    scrollToBott();
}