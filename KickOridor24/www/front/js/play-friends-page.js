async function inviteListe(){
    var formDataJSON = {};
    var user = getCookie("username");
    formDataJSON["username"] = user;
    try {
        const response = await fetch('/api/askInviteList', {
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
                console.log(data);
                var friendsDemands = document.getElementsByClassName("friendsDemands")[0];
                var cont = friendsDemands.getElementsByClassName("cont")[0];

                while(cont.firstChild)
                    cont.removeChild(cont.firstChild);

                if(data.length === 0){
                    var para = document.createElement("p");
                    para.textContent = "Aucune invitation trouvée";
                    para.style.fontWeight = 'bold';
                    cont.appendChild(para);
                    document.getElementsByClassName("notification-demandes")[0].style.display ='none';
                }else {
                    document.getElementsByClassName("notification-demandes")[0].style.display ='flex';
                    document.getElementsByClassName("notification-badge")[0].style.display ='flex';
                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var username = data[i].user["username"];

                        var img = document.createElement("img");
                        if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                            img.style.width = '6.25vh';
                            img.style.height = '6.25vh';
                            //border
                            img.style.border = '5px solid #E4E5E7';
                            img.style.borderRadius = '50%';
                            img.style.marginLeft = '-2vh';
                        }
                        div.appendChild(img);
                        var nom = document.createElement("p");

                        nom.textContent = username;
                        if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                            nom.style.textOverflow = 'ellipsis';
                            nom.style.overflow = 'hidden';
                            nom.style.maxWidth = '10vh';
                        }
                        else{
                            nom.style.textOverflow = 'ellipsis';
                            nom.style.overflow = 'hidden';
                            nom.style.maxWidth = '15vh';
                        }
                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i].user["elo"];
                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
                        elo.classList.add("elo");
                        div.appendChild(elo);
                        if(parseInt( data[i]["elo"]) > 1999){
                            if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/ucl-modifie.png")';
                            }
                            else{div.style.background ='url("images/uclTest.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>1499){
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/europa-modifie.png")';
                            }
                            else{div.style.background ='url("images/europaTest.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>999){
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/conference-modifie.png")';
                            }
                            else{div.style.background ='url("images/conferencetest.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>499){
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/ligue1-modifie.png")';
                            }
                            else{div.style.background ='url("images/ligue1.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'repeat';
                            div.style.backgroundPosition = 'center';
                        }else{
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/ligue2-modifie.png")';
                            }
                            else{div.style.background ='url("images/ligue2.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }
                        let btnV = document.createElement("button");
                        btnV.textContent = "ACCEPTER";
                        btnV.classList.add("addBTN");

                        btn.style.backgroundColor = '#00b7c4';

                        //hover
                        btnV.addEventListener('mouseover', function() {
                                btnV.style.backgroundColor = '#31a5ad';
                                btnV.style.opacity = '1';
                                btnV.style.transform = 'translateY(0)';
                                btnV.style.transitionDuration = '.35s';
                                btnV.style.boxShadow = 'rgba(231, 76, 60, .2) 0 6px 12px';

                            }
                        );
                        btnV.addEventListener('mouseout', function() {
                                btnV.style.backgroundColor = '#00b7c4';
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
                                setCookie("player", "2", 1);
                                joinGame(usernameValue, data[0].room);
                                //validateAskFriend(getCookie("username"), usernameValue);
                            };
                        }());

                        div.appendChild(btnV);

                        cont.appendChild(div);
                    }
                }

            })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des invitations : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}

async function joinGame(username, room) {
    await refuseAskInvite(getCookie("username"));

    window.location.href = "waiting-friend.html?room=" + room + "&friend=" + username;

}

async function refuseAskInvite(emetteur){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    try {
        const response = await fetch('/api/refuseAskInvite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors du rejet de l\'invitation : ' + err);
        }else{
            inviteListe();
        }

    } catch (error) {
        alert(error.message);
    }
}

async function validateAskInvite(emetteur,receveur){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    formDataJSON["receveur"] = receveur;
    try {
        const response = await fetch('/api/validateAskInvite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        //TODO AJOUTER REDIRECTION VERS ROOM

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors de la validation de l\'invitation : ' + err);
        }else{
            await inviteListe();
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
                    para.style.fontWeight = 'bold';
                    cont.appendChild(para);
                }else {

                    for (var i = 0; i < data.length; i++) {
                        var div= document.createElement("div");
                        div.classList.add("profilAmis");
                        var username = data[i]["username"];

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                            img.style.width = '6.25vh';
                            img.style.height = '6.25vh';
                            //border
                            img.style.border = '5px solid #E4E5E7';
                            img.style.borderRadius = '50%';
                            img.style.marginLeft = '-2vh';
                        }
                        div.appendChild(img);
                        let nom = document.createElement("p");

                        nom.textContent = username;
                        nom.style.width = '10vh';
                        div.appendChild(nom);
                        let elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        elo.classList.add("elo");
                        div.appendChild(elo);
                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
                        if(parseInt( data[i]["elo"]) > 1999){
                            if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/ucl-modifie.png")';
                            }
                            else{div.style.background ='url("images/uclTest.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>1499){
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/europa-modifie.png")';
                            }
                            else{div.style.background ='url("images/europaTest.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i]["elo"])>999){
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/conference-modifie.png")';
                            }
                            else{div.style.background ='url("images/conferencetest.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                            div.appendChild(elo);
                        }else if(parseInt( data[i]["elo"])>499){
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/ligue1-modifie.png")';
                            }
                            else{div.style.background ='url("images/ligue1.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'repeat';
                            div.style.backgroundPosition = 'center';
                        }else{
                            if (window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                div.style.background ='url("images/ligue2-modifie.png")';
                            }
                            else{div.style.background ='url("images/ligue2.png")';}
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }

                        let btn = document.createElement("button");
                        btn.textContent = "INVITE";
                        btn.classList.add("addBTN");

                        btn.style.backgroundColor = '#00b7c4';

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
                                btn.style.backgroundColor = '#00b7c4';
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
                                console.log("invite");
                                console.log("username : ", usernameValue);

                                createRoom(usernameValue);
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



function createRoom(receveur){
    setCookie("player", "1", 1);
    window.location.href = "waiting-friend.html?&friend=" + receveur;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Appeler vos fonctions asynchrones ici
    await listeAmis();
    await inviteListe();
    await notif();
});
window.addEventListener('resize', function() {
    location.reload();
}, false);





