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
}