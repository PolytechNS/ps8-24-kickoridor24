function showRegle(){
    document.getElementsByClassName("Regles")[0].style.display = "flex";
    document.getElementsByClassName("Commandes")[0].style.display = "none";
    document.getElementsByClassName("Classement")[0].style.display = "none";
    document.getElementById("regle").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("classement").style.borderBottom = "none";
    document.getElementById("commande").style.borderBottom = "none";
    document.getElementById("commande").style.backgroundColor = "#E4E5E7";
    document.getElementById("classement").style.backgroundColor = "#E4E5E7";
    document.getElementById("regle").style.backgroundColor = "#3EE4F0";
}

function showCommandes(){
    document.getElementsByClassName("Commandes")[0].style.display = "flex";
    document.getElementsByClassName("Regles")[0].style.display = "none";
    document.getElementsByClassName("Classement")[0].style.display = "none";
    document.getElementById("commande").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("classement").style.borderBottom = "none";
    document.getElementById("regle").style.borderBottom = "none";
    document.getElementById("commande").style.backgroundColor = "#3EE4F0";
    document.getElementById("classement").style.backgroundColor = "#E4E5E7";
    document.getElementById("regle").style.backgroundColor = "#E4E5E7";
}

function showRangs(){
    document.getElementsByClassName("Classement")[0].style.display = "flex";
    document.getElementsByClassName("Regles")[0].style.display = "none";
    document.getElementsByClassName("Commandes")[0].style.display = "none";
    document.getElementById("classement").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("commande").style.borderBottom = "none";
    document.getElementById("regle").style.borderBottom = "none";
    document.getElementById("classement").style.backgroundColor = "#3EE4F0";
    document.getElementById("commande").style.backgroundColor = "#E4E5E7";
    document.getElementById("regle").style.backgroundColor = "#E4E5E7";
}