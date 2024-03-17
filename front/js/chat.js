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

async function sendMessage(){
    var message = document.getElementById('messageInput').value;
    var username = getCookie("username");

    const formDataJSON = {};
    formDataJSON["message"] = message;
    formDataJSON["username"] = username;
    try {
        const response = await fetch('/api/sendMessage', {
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
                document.getElementById('messageInput').value = "";
            })
            .catch(error => {
                console.error('Une erreur est survenue lors de l\'envoi du message : ', error);
            });

    } catch (e) {
        alert(e.message);
    }
}