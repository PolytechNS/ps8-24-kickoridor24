const photos = ['Bellingham','Haaland','Harit','Kane','Lacazette','Mbappe','Mitroglu'
    ,'Modric','Pedri','Salah','Son','Vlahovic'];

const celebrations = ['Belli-goal','Charo','Dab','SIUU'];

var nomDequipe;
var adresseMail;
var motDePasse;
var img;
var celebration;
var photoSelected;
var celebrationSelected;

const rechercheCelebration = document.getElementById("rechercheCelebration");
rechercheCelebration.addEventListener('keydown', function(event) {
    // Vérifier si la touche appuyée est la touche "Entrée" (code 13)
    if (event.keyCode === 13) {

        fillCelebration();
    }
});
const recherchePhoto = document.getElementById("recherchePhoto");
recherchePhoto.addEventListener('keydown', function(event) {
    // Vérifier si la touche appuyée est la touche "Entrée" (code 13)
    if (event.keyCode === 13) {

        fillPhoto();
    }
});
function showCeleb(){
    document.getElementsByClassName("info")[0].style.display = "none";
    document.getElementsByClassName("photo")[0].style.display = "none";
    document.getElementsByClassName("celebration")[0].style.display = "flex";
    document.getElementById("celeb").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("info").style.borderBottom = "none";
    document.getElementById("photo").style.borderBottom = "none";
    document.getElementById("celeb").style.backgroundColor = "#3EE4F0";
    document.getElementById("info").style.backgroundColor = "#E4E5E7";
    document.getElementById("photo").style.backgroundColor = "#E4E5E7";
    fillCelebration();

}

function showInfo(){
    document.getElementsByClassName("info")[0].style.display = "flex";
    document.getElementsByClassName("photo")[0].style.display = "none";
    document.getElementsByClassName("celebration")[0].style.display = "none";
    document.getElementById("info").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("photo").style.borderBottom = "none";
    document.getElementById("celeb").style.borderBottom = "none";
    document.getElementById("celeb").style.backgroundColor = "#E4E5E7";
    document.getElementById("photo").style.backgroundColor = "#E4E5E7";
    document.getElementById("info").style.backgroundColor = "#3EE4F0";
}

function showPhoto(){
    document.getElementsByClassName("info")[0].style.display = "none";
    document.getElementsByClassName("photo")[0].style.display = "flex";
    document.getElementsByClassName("celebration")[0].style.display = "none";
    document.getElementById("photo").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("info").style.borderBottom = "none";
    document.getElementById("celeb").style.borderBottom = "none";
    document.getElementById("celeb").style.backgroundColor = "#E4E5E7";
    document.getElementById("info").style.backgroundColor = "#E4E5E7";
    document.getElementById("photo").style.backgroundColor = "#3EE4F0";
    fillPhoto();
}


var gif = document.getElementById('celebrationChoisieInfo');

gif.addEventListener('mouseenter', function() {
    var tmp = gif.src;
    tmp = tmp.replace("png","gif");
    gif.src = tmp;
});

gif.addEventListener('mouseleave', function() {
    var tmp = gif.src;
    tmp = tmp.replace("gif","png");
    gif.src = tmp;
});

function fillPhoto(){
    var imagesContainer = document.getElementById('gridpdp');
    const recherche = recherchePhoto.value;
    while (imagesContainer.firstChild){
        imagesContainer.removeChild(imagesContainer.firstChild);
    }
    var nameSelected = document.getElementById("namePhotoProfil").textContent;
    photos.forEach(fileName => {

        if(fileName.toLowerCase().includes(recherche.toLowerCase())) {
            const div = document.createElement('div');
            div.classList.add("affichagePhoto");

            const img = document.createElement('img');

            img.src = '../images/photoProfil/' + fileName + '.png';

            div.appendChild(img);
            const p = document.createElement('p');
            p.textContent = fileName;
            div.appendChild(p);
            imagesContainer.appendChild(div);

                if (fileName == nameSelected) {
                    div.classList.add("selected");
                    photoSelected = div;
                }

            div.addEventListener('click', function () {
                if (!div.classList.contains("selected")) {
                    div.classList.add('selected');
                    photoSelected.classList.remove('selected');
                    photoSelected = div;
                    selectNewImg();
                }

            });
        }
    });
}

function fillCelebration(){
    var celebChoisie = document.getElementById('celebrationChoisieCeleb');
    const recherche = rechercheCelebration.value;

    celebChoisie.addEventListener('mouseenter', function() {
        var tmp = celebChoisie.src;
        tmp = tmp.replace("png","gif");
        celebChoisie.src = tmp;
    });

    celebChoisie.addEventListener('mouseleave', function() {
        var tmp = celebChoisie.src;
        tmp = tmp.replace("gif","png");
        celebChoisie.src = tmp;
    });

    var imagesContainer = document.getElementById('gridCeleb');
    while (imagesContainer.firstChild){
        imagesContainer.removeChild(imagesContainer.firstChild);
    }
    var nameSelected = document.getElementById("nameCelebrationCeleb").textContent;
    celebrations.forEach(fileName => {
        if(fileName.toLowerCase().includes(recherche.toLowerCase())) {
            const div = document.createElement('div');
            div.classList.add("affichageCeleb");
            const img = document.createElement('img');

            img.src = '../images/celebration/' + fileName + '.png';
            img.addEventListener('mouseenter', function () {
                var tmp = img.src;
                tmp = tmp.replace("png", "gif");
                img.src = tmp;
            });

            img.addEventListener('mouseleave', function () {
                var tmp = img.src;
                tmp = tmp.replace("gif", "png");
                img.src = tmp;
            });
            div.appendChild(img);
            const p = document.createElement('p');
            p.textContent = fileName;
            div.appendChild(p);
            imagesContainer.appendChild(div);

                if (fileName == nameSelected) {
                    div.classList.add("selected");
                    celebrationSelected = div;
                }

            div.addEventListener('click', function () {
                if (!div.classList.contains("selected")) {
                    div.classList.add('selected');
                    celebrationSelected.classList.remove('selected');
                    celebrationSelected = div;
                    selectNewCeleb();
                }

            });
        }
    });
}

async function recupInfoJoueur(){
    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    try {
        const response = await fetch('/api/retrieveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la récupération des informations : ' + response.status);
            }

            return response.json(); // Convertit la réponse en JSON
        }).then(data => {
            nomDequipe = data["username"];
            adresseMail = data["email"];
            motDePasse = data["password"];
            img = data["img"];
            celebration = data["celebration"];
            fillData();
        });


    } catch (error) {
        alert(error.message);
    }
}
recupInfoJoueur();

function fillData(){
    document.getElementById("nomEquipeInput").value = nomDequipe;
    document.getElementById("nomEquipeInput").addEventListener('keydown', function(event) {
        // Vérifier si la touche appuyée est la touche "Entrée" (code 13)
        if (event.keyCode === 13) {

            newName();
        }
    });
    document.getElementById("mailInput").value = adresseMail;
    document.getElementById("mailInput").addEventListener('keydown', function(event) {
        // Vérifier si la touche appuyée est la touche "Entrée" (code 13)
        if (event.keyCode === 13) {

            newMail();
        }
    });
    document.getElementById("motDePasseInput").value = motDePasse;
    document.getElementById("motDePasseInput").addEventListener('keydown', function(event) {
        // Vérifier si la touche appuyée est la touche "Entrée" (code 13)
        if (event.keyCode === 13) {

            newMDP();
        }
    });
    document.getElementById("photoChoisieInfo").src = img;
    var nomFichier = img.split("/").pop().split(".")[0];
    document.getElementById("namePhotoInfo").textContent = nomFichier;

    document.getElementById("celebrationChoisieInfo").src = celebration +".png";
    var partieDernierSlash = celebration.split("/").pop();
    document.getElementById("nameCelebrationInfo").textContent = partieDernierSlash;

    document.getElementById("photoChoisieProfil").src = img;

    document.getElementById("namePhotoProfil").textContent = nomFichier;

    document.getElementById("celebrationChoisieCeleb").src = celebration +".png";

    document.getElementById("nameCelebrationCeleb").textContent = partieDernierSlash;

}

async function  selectNewCeleb(){
    celebration = celebrationSelected.getElementsByTagName('img')[0].src;
    celebration =  celebration.replace(/\.[^/.]+$/, "");
    fillData();

    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    formDataJSON["celebration"] = celebration;
    try {
        const response = await fetch('/api/changeCelebration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors du changement de célébration : ' + response.status);
            }
        });


    } catch (error) {
        alert(error.message);
    }
}
async function  selectNewImg(){
    img = photoSelected.getElementsByTagName('img')[0].src;
    fillData();

    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    formDataJSON["img"] = img;
    try {
        const response = await fetch('/api/changeImg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors du changement d\'image : ' + response.status);
            }

        });


    } catch (error) {
        alert(error.message);
    }
}

async function  newName(){
 /*   img = photoSelected.getElementsByTagName('img')[0].src;
    fillData();

    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    formDataJSON["img"] = img;
    try {
        const response = await fetch('/api/changeImg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors du changement d\'image : ' + response.status);
            }

        });


    } catch (error) {
        alert(error.message);
    }*/
}
async function  newMail(){
       adresseMail = document.getElementById("mailInput").value;
       fillData();

       const formDataJSON = {};
       formDataJSON["username"] = getCookie("username");
       formDataJSON["email"] = adresseMail;
       try {
           const response = await fetch('/api/changeMail', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(formDataJSON)
           }).then(response => {
               if (!response.ok) {
                   throw new Error('Une erreur est survenue lors du changement de mail : ' + response.status);
               }

           });


       } catch (error) {
           alert(error.message);
       }
}
async function  newMDP(){
    motDePasse = document.getElementById("motDePasseInput").value;
    fillData();

    const formDataJSON = {};
    formDataJSON["username"] = getCookie("username");
    formDataJSON["password"] = motDePasse;
    try {
        const response = await fetch('/api/changeMDP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors du changement de mot de passe : ' + response.status);
            }

        });


    } catch (error) {
        alert(error.message);
    }
}