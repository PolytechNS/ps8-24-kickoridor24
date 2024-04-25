
function showRegle(){
    console.log("showRegle")
    document.getElementsByClassName("Regles")[0].style.display = "flex";
    document.getElementsByClassName("Commandes")[0].style.display = "none";
    document.getElementsByClassName("Classement")[0].style.display = "none";
    document.getElementById("regle").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("classement").style.borderBottom = "none";
    document.getElementById("commande").style.borderBottom = "none";
    document.getElementById("commande").style.backgroundColor = "#E4E5E7";
    document.getElementById("classement").style.backgroundColor = "#E4E5E7";
    document.getElementById("regle").style.backgroundColor = "#3EE4F0";
    navigator.vibrate(200)
}

function showCommandes(){
    console.log("showCommandes")
    document.getElementsByClassName("Commandes")[0].style.display = "flex";
    document.getElementsByClassName("Regles")[0].style.display = "none";
    document.getElementsByClassName("Classement")[0].style.display = "none";
    document.getElementById("commande").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("classement").style.borderBottom = "none";
    document.getElementById("regle").style.borderBottom = "none";
    document.getElementById("commande").style.backgroundColor = "#3EE4F0";
    document.getElementById("classement").style.backgroundColor = "#E4E5E7";
    document.getElementById("regle").style.backgroundColor = "#E4E5E7";
    navigator.vibrate(200)
}

function showRangs(){
    console.log("showRangs")
    document.getElementsByClassName("Classement")[0].style.display = "flex";
    document.getElementsByClassName("Regles")[0].style.display = "none";
    document.getElementsByClassName("Commandes")[0].style.display = "none";
    document.getElementById("classement").style.borderBottom = "4px solid #eb4f61";
    document.getElementById("commande").style.borderBottom = "none";
    document.getElementById("regle").style.borderBottom = "none";
    document.getElementById("classement").style.backgroundColor = "#3EE4F0";
    document.getElementById("commande").style.backgroundColor = "#E4E5E7";
    document.getElementById("regle").style.backgroundColor = "#E4E5E7";
    navigator.vibrate(200)
}

const dropdowns = document.querySelectorAll('.navClass2');
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const fleche = dropdown.querySelector('.fleche');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    //si pas connecté, supprimer de la liste l'id "ligne"
    if(localStorage.getItem("username") == null && document.getElementById("ligne2") != null){
        var ligne = document.getElementById("ligne2");
        ligne.getElementsByTagName('a')[0].style.color = "#B9C0C6";
        ligne.getElementsByTagName('a')[0].style.cursor = "default";
        ligne.getElementsByTagName('a')[0].style.pointerEvents = "none";
        //enlever le onclick de l'id desac
        var desac = document.getElementById("desac");
        desac.removeAttribute("onclick");
        selected.innerText = "Hors ligne";
    }

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        fleche.classList.toggle('fleche-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
    option.addEventListener('click', () =>{

        if(localStorage.getItem("username") == null && option.id == "desac"){}

        else{
            selected.innerText = option.innerText;
        }
        select.classList.remove('select-clicked');
        fleche.classList.remove('fleche-rotate');
        menu.classList.remove('menu-open');
    });
});
});