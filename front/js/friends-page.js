async function ajouterAmisListe(){
    var name = document.getElementById('searchInput').value;

    const formDataJSON = {};
    formDataJSON["recherche"] = name;
    formDataJSON["username"] = getCookie("username");
    try {
        const response = await fetch('/api/FindFriends', {
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
                var cont = document.getElementById("resultatRechercheAmis");


                while(cont.firstChild)
                    cont.removeChild(cont.firstChild);

                if(data.length === 0){
                    var para = document.createElement("p");
                    para.textContent = "Aucun utilisateur trouvé";
                    cont.appendChild(para);
                }else {

                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        div.appendChild(img);
                        var nom = document.createElement("p");
                        var username = data[i]["username"];
                        nom.textContent = username;
                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            div.style.background ='url("images/ucl.png")';
                        }else if(parseInt( data[i]["elo"])>1499){
                            div.style.background ='url("images/europa.jpg")';
                        }else{
                            div.style.background ='url("images/conference.png")';
                        }

                        var btn = document.createElement("button");
                        btn.textContent = "add";
                        btn.addEventListener('click', function() {
                            var usernameValue = username; // Capturer la valeur de username dans cette portée
                            return function() {
                                askFriend(getCookie("username"), usernameValue);
                            };
                        }());


                        div.appendChild(btn);
                        cont.appendChild(div);
                    }
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des joueurs : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}
async function askFriend(emetteur,receveur){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    formDataJSON["receveur"] = receveur;
    try {
        const response = await fetch('/api/askFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors de la demande d\'amis : ' + err);
        }

    } catch (error) {
        alert(error.message);
    }
}


async function demandesAmisListe(){
    var formDataJSON = {};
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
                var friendsDemands = document.getElementsByClassName("friendsDemands")[0];
                var cont = friendsDemands.getElementsByClassName("cont")[0];

                while(cont.firstChild)
                    cont.removeChild(cont.firstChild);

                if(data.length === 0){
                    var para = document.createElement("p");
                    para.textContent = "Aucune demande d'amis trouvée";
                    cont.appendChild(para);
                    document.getElementsByClassName("notification-demandes")[0].style.display ='none';
                }else {
                    document.getElementsByClassName("notification-demandes")[0].style.display ='flex';
                    document.getElementsByClassName("notification-badge")[0].style.display ='flex';
                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var username = data[i]["username"];
                        var btnD = document.createElement("button");
                        btnD.textContent = "delete";
                        btnD.addEventListener('click', function() {
                            var usernameValue = username; // Capturer la valeur de username dans cette portée
                            return function() {
                                deleteAskFriend(getCookie("username"), usernameValue);
                            };
                        }());

                        div.appendChild(btnD);

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        div.appendChild(img);
                        var nom = document.createElement("p");

                        nom.textContent = username;
                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            div.style.background ='url("images/ucl.png")';
                        }else if(parseInt( data[i]["elo"])>1499){
                            div.style.background ='url("images/europa.jpg")';
                        }else{
                            div.style.background ='url("images/conference.png")';
                        }

                        var btnV = document.createElement("button");
                        btnV.textContent = "add";
                        btnV.addEventListener('click', function() {
                            var usernameValue = username; // Capturer la valeur de username dans cette portée
                            return function() {
                                validateAskFriend(getCookie("username"), usernameValue);
                            };
                        }());

                        div.appendChild(btnV);

                        cont.appendChild(div);
                    }
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des demandes d\'amis : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}

async function deleteAskFriend(emetteur,receveur){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    formDataJSON["receveur"] = receveur;
    try {
        const response = await fetch('/api/deleteAskFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors du rejet de la demande : ' + err);
        }else{
            demandesAmisListe();
        }

    } catch (error) {
        alert(error.message);
    }
}

async function validateAskFriend(emetteur,receveur){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    formDataJSON["receveur"] = receveur;
    try {
        const response = await fetch('/api/validateAskFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors de la validation de la demande : ' + err);
        }else{
           await demandesAmisListe();
            await listeAmis();
        }

    } catch (error) {
        alert(error.message);
    }
}
async function listeAmis(){
    const formDataJSON = {};
    var user = getCookie("username");
    formDataJSON["username"] = user;

    try {
        const response = await fetch('/api/friendsList', {
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

                var friendsDemands = document.getElementsByClassName("friendsList")[0];
                var cont = friendsDemands.getElementsByClassName("cont")[0];

                while(cont.firstChild)
                    cont.removeChild(cont.firstChild);

                if(data.length === 0){
                    var para = document.createElement("p");
                    para.textContent = "Aucun ami trouvé";
                    cont.appendChild(para);
                }else {

                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var username = data[i]["username"];

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        div.appendChild(img);
                        var nom = document.createElement("p");

                        nom.textContent = username;
                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            div.style.background ='url("images/ucl.png")';
                        }else if(parseInt( data[i]["elo"])>1499){
                            div.style.background ='url("images/europa.jpg")';
                        }else{
                            div.style.background ='url("images/conference.png")';
                        }

                        var btn = document.createElement("button");
                        btn.textContent = "delete";
                        btn.addEventListener('click', function() {
                            var usernameValue = username; // Capturer la valeur de username dans cette portée
                            return function() {
                                deleteFriend(getCookie("username"), usernameValue);
                            };
                        }());

                        div.appendChild(btn);

                        cont.appendChild(div);
                    }
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des amis : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}

async function deleteFriend(emetteur,receveur){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    formDataJSON["receveur"] = receveur;
    try {
        const response = await fetch('/api/deleteFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors de la suppression de l\'amis : ' + err);
        }else{
            listeAmis();
        }

    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Appeler vos fonctions asynchrones ici
    await listeAmis();

     await demandesAmisListe();


});


