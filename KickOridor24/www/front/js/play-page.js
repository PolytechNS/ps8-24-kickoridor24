document.getElementById("hors").addEventListener('click',function (){
    showHorsLignePlay();
})
if(getCookie("username") == null){
    showHorsLignePlay()
    var ligne = document.getElementById("ligne");
    ligne.getElementsByTagName('a')[0].style.color = "#B9C0C6";
}else{
    document.getElementById("ligne").addEventListener('click',function (){
        showOnlinePlay()
    })
}