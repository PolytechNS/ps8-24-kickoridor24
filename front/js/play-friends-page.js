let roomId;

/*async function askFriend(emetteur,receveur){
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
}*/


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
                        var username = data[i]["username"];

                        var img = document.createElement("img");
                        img.src = data[i]["img"];
                        div.appendChild(img);
                        var nom = document.createElement("p");

                        nom.textContent = username;
                        nom.style.width = '10vh';
                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
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
                        btnV.textContent = "ACCEPTER";
                        btnV.style.marginLeft = '-5vw';
                        btnV.style.appearance = 'none';
                        btnV.style.backfaceVisibility = 'hidden';
                        btnV.style.backgroundColor = '#38cfda';
                        btnV.style.borderRadius = '8px';
                        btnV.style.borderStyle = 'none';
                        btnV.style.boxShadow = 'rgba(231, 76, 60, .15) 0 4px 9px';
                        btnV.style.boxSizing = 'border-box';
                        btnV.style.color = '#fff';
                        btnV.style.cursor = 'pointer';
                        btnV.style.display = 'inline-block';
                        btnV.style.fontFamily = 'Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif';
                        btnV.style.fontSize = '11px';
                        btnV.style.fontWeight = '600';
                        btnV.style.letterSpacing = 'normal';
                        btnV.style.lineHeight = '1.5';
                        btnV.style.outline = 'none';
                        btnV.style.overflow = 'hidden';
                        btnV.style.padding = '4px 8px';
                        btnV.style.position = 'relative';
                        btnV.style.textAlign = 'center';
                        btnV.style.textDecoration = 'none';
                        btnV.style.transform = 'translate3d(0, 0, 0)';
                        btnV.style.transition = 'all .3s';
                        btnV.style.userSelect = 'none';
                        btnV.style.webkitUserSelect = 'none';
                        btnV.style.touchAction = 'manipulation';
                        btnV.style.verticalAlign = 'top';
                        btnV.style.whiteSpace = 'nowrap';
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
                        btnD.textContent = "REFUSER";

                        btnD.style.appearance = 'none';
                        btnD.style.backfaceVisibility = 'hidden';
                        btnD.style.backgroundColor = '#eb4f61';
                        btnD.style.borderRadius = '8px';
                        btnD.style.borderStyle = 'none';
                        btnD.style.boxShadow = 'rgba(231, 76, 60, .15) 0 4px 9px';
                        btnD.style.boxSizing = 'border-box';
                        btnD.style.color = '#fff';
                        btnD.style.cursor = 'pointer';
                        btnD.style.display = 'inline-block';
                        btnD.style.fontFamily = 'Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif';
                        btnD.style.fontSize = '11px';
                        btnD.style.fontWeight = '600';
                        btnD.style.letterSpacing = 'normal';
                        btnD.style.lineHeight = '1.5';
                        btnD.style.outline = 'none';
                        btnD.style.overflow = 'hidden';
                        btnD.style.padding = '4px 8px';
                        btnD.style.position = 'relative';
                        btnD.style.textAlign = 'center';
                        btnD.style.textDecoration = 'none';
                        btnD.style.transform = 'translate3d(0, 0, 0)';
                        btnD.style.transition = 'all .3s';
                        btnD.style.userSelect = 'none';
                        btnD.style.webkitUserSelect = 'none';

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
                                console.log("delete");
                                console.log("username : ", usernameValue);
                                //deleteAskFriend(getCookie("username"), usernameValue);
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
                        nom.style.width = '10vh';
                        div.appendChild(nom);
                        let elo = document.createElement("p");
                        elo.textContent = data[i]["elo"];
                        div.appendChild(elo);
                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
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
                        btn.textContent = "INVITE";

                        btn.style.appearance = 'none';
                        btn.style.backfaceVisibility = 'hidden';
                        btn.style.backgroundColor = '#38cfda';
                        btn.style.borderRadius = '8px';
                        btn.style.borderStyle = 'none';
                        btn.style.boxShadow = 'rgba(231, 76, 60, .15) 0 4px 9px';
                        btn.style.boxSizing = 'border-box';
                        btn.style.color = '#fff';
                        btn.style.cursor = 'pointer';
                        btn.style.display = 'inline-block';
                        btn.style.fontFamily = 'Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif';
                        btn.style.fontSize = '11px';
                        btn.style.fontWeight = '600';
                        btn.style.letterSpacing = 'normal';
                        btn.style.lineHeight = '1.5';
                        btn.style.outline = 'none';
                        btn.style.overflow = 'hidden';
                        btn.style.padding = '4px 8px';
                        btn.style.position = 'relative';
                        btn.style.textAlign = 'center';
                        btn.style.textDecoration = 'none';
                        btn.style.transform = 'translate3d(0, 0, 0)';
                        btn.style.transition = 'all .3s';
                        btn.style.userSelect = 'none';
                        btn.style.webkitUserSelect = 'none';
                        btn.style.touchAction = 'manipulation';
                        btn.style.verticalAlign = 'top';
                        btn.style.whiteSpace = 'nowrap';
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
                                if(!roomId){
                                    createRoom(usernameValue);
                                }else{
                                    alert("Vous avez déjà une invitation en cours");
                                }
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

async function inviteFriend(emetteur,receveur, roomId){
    const formDataJSON = {};
    formDataJSON["emetteur"] = emetteur;
    formDataJSON["receveur"] = receveur;
    formDataJSON["room"] = roomId;
    try {
        const response = await fetch('/api/inviteFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors de l\'invitation de l\'amis : ' + err);
        }

        window.location.href = "waiting-friend.html?room=" + roomId + "&friend=" + receveur;

    } catch (error) {
        alert(error.message);
    }
}

function createRoom(receveur){
    socket.emit('joinGame');
    socket.on('joinedGame', async (room) => {
        console.log(room);
        roomId = room;
        await inviteFriend(getCookie("username"), receveur, roomId);
    });
}


/*async function deleteFriend(emetteur,receveur){
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
}*/

document.addEventListener('DOMContentLoaded', async () => {
    // Appeler vos fonctions asynchrones ici
    await listeAmis();
    await demandesAmisListe();
    await notif();
});




