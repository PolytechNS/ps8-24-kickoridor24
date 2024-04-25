const aspectRatio = window.innerWidth / window.innerHeight;

const inputElement = document.getElementById('searchInput');

// Ajout de l'écouteur d'événements
inputElement.addEventListener('keydown', function(event) {
    // Vérifie si la touche pressée est "Entrée" (code 13)
    if (event.keyCode === 13) {
        // Placez ici le code que vous souhaitez exécuter lorsque la touche "Entrée" est pressée
        ajouterAmisListe()
    }
});
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
                    para.style.fontWeight = 'bold';
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
                        nom.classList.add("amiName");

                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
                        elo.classList.add("elo");
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            div.style.background ='url("images/uclTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>1499){
                            div.style.background ='url("images/europaTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>999){
                            div.style.background ='url("images/conferencetest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>499){
                            div.style.background ='url("images/ligue1.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'repeat';
                            div.style.backgroundPosition = 'center';
                        }else{
                            div.style.background ='url("images/ligue2.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }

                        let btn = document.createElement("button");
                        btn.textContent = "AJOUTER";
                        btn.classList.add("addBTN");

                        btn.style.backgroundColor = '#38cfda';

                        //hover
                        btn.addEventListener('mouseover', function() {
                            btn.style.backgroundColor = '#31a5ad';
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                            btn.style.transitionDuration = '.35s';
                            btn.style.boxShadow = 'rgba(231, 76, 60, .2) 0 6px 12px';

                        }
                        );
                        btn.addEventListener('mouseout', function() {
                            btn.style.backgroundColor = '#38cfda';
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                            btn.style.transitionDuration = '.35s';

                        }
                        );
                        //mouseactive
                        btn.addEventListener('mousedown', function() {
                            btn.style.transform = 'translateY(2px)';
                            btn.style.transitionDuration = '.35s';
                        }
                        );
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
        console.log(e.message);
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
        console.log(error.message);
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
                    para.style.fontWeight = 'bold';
                    cont.appendChild(para);
                    document.getElementsByClassName("notification-demandes")[0].style.display ='none';
                }else {
                    document.getElementsByClassName("notification-demandes")[0].style.display ='flex';
                    document.getElementsByClassName("notification-badge")[0].style.display ='flex';
                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var username = data[i]["username"];

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        div.appendChild(img);
                        var nom = document.createElement("p");

                        nom.textContent = username;
                        nom.classList.add("amiName");

                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
                        elo.classList.add("elo");
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            div.style.background ='url("images/uclTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>1499){
                            div.style.background ='url("images/europaTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>999){
                            div.style.background ='url("images/conferencetest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>499){
                            div.style.background ='url("images/ligue1.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'repeat';
                            div.style.backgroundPosition = 'center';
                        }else{
                            div.style.background ='url("images/ligue2.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }
                        let btnV = document.createElement("button");
                        btnV.textContent = "AJOUTER";
                        btnV.classList.add("addBTN");
                        btnV.style.backgroundColor = '#38cfda';

                        btnV.addEventListener('mouseover', function() {
                            btnV.style.backgroundColor = '#31a5ad';
                            btnV.style.opacity = '1';
                            btnV.style.transform = 'translateY(0)';
                            btnV.style.transitionDuration = '.35s';
                            btnV.style.boxShadow = 'rgba(231, 76, 60, .2) 0 6px 12px';

                        }
                        );
                        btnV.addEventListener('mouseout', function() {
                            btnV.style.backgroundColor = '#38cfda';
                            btnV.style.opacity = '1';
                            btnV.style.transform = 'translateY(0)';
                            btnV.style.transitionDuration = '.35s';
                        }
                        );
                        //mouseactive
                        btnV.addEventListener('mousedown', function() {
                            btnV.style.transform = 'translateY(2px)';
                            btnV.style.transitionDuration = '.35s';
                        }
                        );
                        btnV.addEventListener('click', function() {
                            var usernameValue = username; // Capturer la valeur de username dans cette portée
                            return function() {
                                validateAskFriend(getCookie("username"), usernameValue);
                            };
                        }());

                        div.appendChild(btnV);

                        let btnD = document.createElement("button");
                        btnD.textContent = "SUPPRIMER";
                        btnD.classList.add("suppBTN");

                        btnD.style.backgroundColor = '#eb4f61';

                        //hover
                        btnD.addEventListener('mouseover', function() {
                                btnD.style.backgroundColor = '#bb404e';
                                btnD.style.opacity = '1';
                                btnD.style.transform = 'translateY(0)';
                                btnD.style.transitionDuration = '.35s';
                                btnD.style.boxShadow = 'rgba(231, 76, 60, .2) 0 6px 12px';

                            }
                        );
                        btnD.addEventListener('mouseout', function() {
                                btnD.style.backgroundColor = '#eb4f61';
                                btnD.style.opacity = '1';
                                btnD.style.transform = 'translateY(0)';
                                btnD.style.transitionDuration = '.35s';
                            }
                        );
                        //mouseactive
                        btnD.addEventListener('mousedown', function() {
                                btnD.style.transform = 'translateY(2px)';
                                btnD.style.transitionDuration = '.35s';

                            }
                        );

                        btnD.addEventListener('click', function() {
                            var usernameValue = username; // Capturer la valeur de username dans cette portée
                            return function() {
                                deleteAskFriend(getCookie("username"), usernameValue);
                            };
                        }());

                        div.appendChild(btnD);

                        cont.appendChild(div);
                    }
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des demandes d\'amis : ', error);
            });

    } catch (e) {
        console.log(e.message);
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
        console.log(error.message);
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
        console.log(error.message);
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
                    para.style.fontWeight = 'bold';
                    cont.appendChild(para);
                }else {

                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var username = data[i]["username"];

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        div.appendChild(img);
                        let nom = document.createElement("p");

                        nom.textContent = username;
                        nom.classList.add("amiName");

                        div.appendChild(nom);
                        let elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        elo.classList.add("elo");

                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            div.style.background ='url("images/uclTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>1499){
                            div.style.background ='url("images/europaTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>999){
                            div.style.background ='url("images/conference-amisPHONE.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>499){
                            div.style.background ='url("images/ligue1.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'repeat';
                            div.style.backgroundPosition = 'center';
                        }else{
                            div.style.background ='url("images/ligue2.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }

                        let btn = document.createElement("button");
                        btn.textContent = "SUPPRIMER";
                        btn.classList.add("suppBTN");

                        btn.style.backgroundColor = '#eb4f61';

                        //hover
                        btn.addEventListener('mouseover', function() {
                            btn.style.backgroundColor = '#bb404e';
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                            btn.style.transitionDuration = '.35s';
                            btn.style.boxShadow = 'rgba(231, 76, 60, .2) 0 6px 12px';
                        }
                        );
                        btn.addEventListener('mouseout', function() {
                            btn.style.backgroundColor = '#eb4f61';
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                            btn.style.transitionDuration = '.35s';
                        }
                        );
                        //mouseactive
                        btn.addEventListener('mousedown', function() {
                            btn.style.transform = 'translateY(2px)';
                            btn.style.transitionDuration = '.35s';
                        }
                        );
                        btn.addEventListener('mouseup', function() {
                            btn.style.transform = 'translateY(0)';
                            btn.style.transitionDuration = '.35s';
                        }
                        );
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
        console.log(e.message);
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
        console.log(error.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Appeler vos fonctions asynchrones ici
    await listeAmis();
     await demandesAmisListe();
     await notif();
});

verifNbFriends();

async function verifNbFriends(){
    var nbFriends

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
                nbFriends = data.length;
            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des amis : ', error);
            });

    } catch (e) {
        console.log(e.message);
    }

    if(nbFriends === 1){
        addAchiev("1f");
    }else if(nbFriends >= 5 && nbFriends < 10){
        addAchiev("2f");
    }else if(nbFriends >= 10){
        addAchiev("3f");
    }
}

async function addAchiev(id){

    const formDataJSON = {};

    formDataJSON["username"] = getCookie("username");
    formDataJSON["achiev"] = id;

    try {
        const response = await fetch('/api/addAchiev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if(!response.ok){
                throw new Error('Erreur de réseau ou HTTP: ' + response.status);
            }
        });
    } catch (error) {
        console.error('Error adding achievement:', error);
    }
}


