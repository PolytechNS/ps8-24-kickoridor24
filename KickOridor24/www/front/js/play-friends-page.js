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
                        img.src = data[i].user["img"];
                        div.appendChild(img);
                        var nom = document.createElement("p");

                        nom.textContent = username;
                        nom.style.width = '10vh';
                        div.appendChild(nom);
                        var elo = document.createElement("p");
                        elo.textContent = data[i].user["elo"];
                        elo.style.width = '8vh';
                        elo.style.fontWeight = 'bold';
                        div.appendChild(elo);
                        if(parseInt( data[i].user["elo"]) > 1999){
                            div.style.background ='url("images/uclTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i].user["elo"])>1499){
                            div.style.background ='url("images/europaTest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i].user["elo"])>999){
                            div.style.background ='url("images/conferencetest.png")';
                            div.style.backgroundSize = 'cover';
                            div.style.backgroundRepeat = 'no-repeat';
                            div.style.backgroundPosition = 'center';
                        }else if(parseInt( data[i].user["elo"])>499){
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




