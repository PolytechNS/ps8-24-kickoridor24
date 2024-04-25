document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    let roomId = urlParams.get('room');
    const friend = urlParams.get('friend');
    const socket = io('/api/game');
    const title = document.getElementById('title');
    title.innerHTML = "Attente de la réponse de " + friend;

    if (getCookie("player") == "1") {
        socket.emit('joinGame');
        socket.on('joinedGame', async (room) => {
            console.log("test : " , room);
            roomId = room;
            await inviteFriend(getCookie("username"), friend, roomId);
        });
    } else {
        console.log("JE VEUX REJOINDRE LA ROOM : " + roomId);

        title.innerHTML = "Rejoindre la partie de " + friend;

        document.getElementById('p1').innerHTML = "La partie est en cours de chargement";
        document.getElementById('p2').innerHTML = "Veuillez patienter";
        document.getElementById('btnQuit').style.display = "none";

        socket.emit('joinGameWithId', roomId);
        socket.on('joinedGameWithId', () => {
            console.log(roomId);
        });
    }

    async function inviteFriend(emetteur, receveur, roomId) {
        console.log("inviteFriend");
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

        } catch (error) {
            alert(error.message);
        }
    }

    socket.on('startGame', (room) => {
        console.log("startGame");
        setCookie("typeDePartie", "enLigne", 1);
        setCookie("option", "friend", 1);
        setCookie("room", room, 1);
        console.log(getCookie("username"));
        console.log(getCookie("player"));
        socket.emit("changePage");
        window.location.href = "gameOnline.html?room=" + room + "&player=" + friend;
    });

    function redirectToMenu() {
        socket.emit('quitRoom');
        setCookie('typeDePartie','',-1);
        window.location.href = "play-page.html";
    }

});



