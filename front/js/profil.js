const photos = ['Bellingham','Haaland','Harit','Kane','Lacazette','Mbappe','Mitroglu'
    ,'Modric','Pedri','Salah','Son','Vlahovic'];

const celebrations = ['Belli-goal','Charo','Dab','SIUU'];

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


var gif = document.getElementById('gifResume');

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
    while (imagesContainer.firstChild){
        imagesContainer.removeChild(imagesContainer.firstChild);
    }
    photos.forEach(fileName => {
        const div = document.createElement('div');
        div.classList.add("affichagePhoto");
        const img = document.createElement('img');

        img.src = '../images/photoProfil/'+fileName+'.png';
      
        div.appendChild(img);
        const p = document.createElement('p');
        p.textContent = fileName;
        div.appendChild(p);
        imagesContainer.appendChild(div);
    });
}

function fillCelebration(){
    var celebChoisie = document.getElementById('celebrationChoisieCeleb');

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
    celebrations.forEach(fileName => {
        const div = document.createElement('div');
        div.classList.add("affichageCeleb");
        const img = document.createElement('img');

        img.src = '../images/celebration/'+fileName+'.png';
        img.addEventListener('mouseenter', function() {
            var tmp = img.src;
            tmp = tmp.replace("png","gif");
            img.src = tmp;
        });

        img.addEventListener('mouseleave', function() {
            var tmp = img.src;
            tmp = tmp.replace("gif","png");
            img.src = tmp;
        });
        div.appendChild(img);
        const p = document.createElement('p');
        p.textContent = fileName;
        div.appendChild(p);
        imagesContainer.appendChild(div);
    });
}