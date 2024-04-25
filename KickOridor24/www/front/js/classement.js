function showVotreClassement(){
    document.getElementsByClassName("VotreClassement")[0].style.display = "flex";
    document.getElementsByClassName("ClassementMondial")[0].style.display = "none";
    document.getElementById("Votre-classement").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("Classement-mondial").style.borderBottom = "none";
    document.getElementById("Classement-mondial").style.backgroundColor = "#E4E5E7";
    document.getElementById("Votre-classement").style.backgroundColor = "#3EE4F0";

    UserClassement();
}

function showClassementMonde(){
    document.getElementsByClassName("ClassementMondial")[0].style.display = "flex";
    document.getElementsByClassName("VotreClassement")[0].style.display = "none";
    document.getElementById("Classement-mondial").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("Votre-classement").style.borderBottom = "none";
    document.getElementById("Classement-mondial").style.backgroundColor = "#3EE4F0";
    document.getElementById("Votre-classement").style.backgroundColor = "#E4E5E7";

    AllUserClassement();
}

document.addEventListener('DOMContentLoaded', async () => {
    // Appeler vos fonctions asynchrones ici
    await UserClassement();
});

async function AllUserClassement() {
    try {
        const users = await fetch('/api/getAllUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau ou HTTP: ' + response.status);
            }
            return response.json(); // Convertit la réponse en JSON
        })

        .then(data => {
        // Trier les utilisateurs par elo, le plus haut en haut
        data.sort((a, b) => b.elo - a.elo);

        var UserList = document.getElementsByClassName("ClassementMondial")[0];
        var userListContainer = UserList.getElementsByClassName("classementMonde")[0];

        while(userListContainer.firstChild)
            userListContainer.removeChild(userListContainer.firstChild);

        if(data.length === 0){
            var para = document.createElement("p");
            para.textContent = "Aucun utilisateur trouvé";
            para.style.fontWeight = 'bold';
            userListContainer.appendChild(para);
        }else {

            for (var i = 0; i < data.length; i++) {
                var div= document.createElement("div");
                div.classList.add("profil");
                var username = data[i]["username"];

                var img = document.createElement("img");
                img.src = data[i]["img"];
                //media query screen and (max-aspect-ratio: 4/3.1)
                if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                    img.style.width = '6.25vh';
                    img.style.height = '6.25vh';
                    //border
                    img.style.border = '5px solid #E4E5E7';
                    img.style.borderRadius = '50%';
                }
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
                userListContainer.appendChild(div);
            }
        }

    })
            .catch(error => {
                console.error('Une erreur est survenue lors de la récupération des utilisateurs : ', error);
            });
    } catch (e) {
        console.log(e.message);
    }
}

async function UserClassement() {
    //classement du user connecté, prendre deux joueurs avant et 5 joueurs apres apres avoir trier par elo
    if (getCookie("username") != null) {
        const formDataJSON = {};
        formDataJSON["username"] = getCookie("username");
        console.log(formDataJSON);
        try {
            const usersResponse = await fetch('/api/getAllUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de réseau ou HTTP: ' + response.status);
                }
                return response.json(); // Convertit la réponse en JSON
            })
                .then(data => {
                    data.sort((a, b) => b.elo - a.elo);

                    const userIndex = data.findIndex(user => user.username === formDataJSON["username"]);
                    const startIndex = Math.max(0, userIndex - 2);
                    const endIndex = Math.min(data.length, userIndex + 5);

                    const UserList = document.getElementsByClassName("VotreClassement")[0];
                    const userListContainer = UserList.getElementsByClassName("votreClass")[0];

                    while (userListContainer.firstChild)
                        userListContainer.removeChild(userListContainer.firstChild);

                    if (data.length === 0) {
                        var para = document.createElement("p");
                        para.textContent = "Aucun utilisateur trouvé";
                        para.style.fontWeight = 'bold';
                        userListContainer.appendChild(para);
                    } else {
                        // Afficher les joueurs dans le classement
                        for (let i = startIndex; i <= endIndex; i++) {
                            if(data[i] === undefined){
                                return;
                            }
                            const div = document.createElement("div");
                            div.classList.add("profil");
                            const username = data[i]["username"];

                            const img = document.createElement("img");
                            img.src = data[i]["img"];
                            if(window.matchMedia("(max-aspect-ratio: 4/3.1)").matches){
                                img.style.width = '7vh';
                                img.style.height = '7vh';
                                //border
                                img.style.border = '5px solid #E4E5E7';
                                img.style.borderRadius = '50%';
                            }
                            div.appendChild(img);

                            const nom = document.createElement("p");
                            nom.textContent = username;
                            nom.style.width = '10vh';
                            div.appendChild(nom);

                            const elo = document.createElement("p");
                            elo.textContent = data[i]["elo"];
                            div.appendChild(elo);
                            elo.style.width = '8vh';
                            elo.style.fontWeight = 'bold';

                            // Appliquer le style en fonction de l'Elo
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

                            if (i === userIndex) {
                                //mettre comme ca filter: brightness(70%);
                                div.style.filter = 'brightness(70%)';

                            }
                            userListContainer.appendChild(div);
                        }
                    }
                })
                .catch(error => {
                    console.error('Une erreur est survenue lors de la récupération des utilisateurs : ', error);
                });
        } catch (e) {
            console.log(e.message);
        }
    }
}
