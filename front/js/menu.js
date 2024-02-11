
function redirectToGame(name, value, days) {
    setCookie(name,value,days);
    window.location.href = "game.html";
}

function redirectToLogin() {
    setCookie("username","",-1);

    window.location.href = "login.html";
}

function redirectToMenu() {
    window.location.href = "index.html";
}

async function checkResumegame(){
    var div =  document.getElementById("resumeGameButton");
 if(getCookie("username") != null){
     const formDataJSON = {};
     formDataJSON["username"] = getCookie("username");
     try {
         const response = await fetch('/api/gameRetrieve', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(formDataJSON)
         }).then(response => {
             if (!response.ok) {
               // div.onclick = null;
                 div.style.opacity = 0.5;
                 div.style.backgroundColor = "#ccc"; // Change la couleur de fond en gris clair
                 div.style.pointerEvents = "none";
             }});}catch (e) {

     }
 }else{

     div.style.display = 'none';
 }
}
checkResumegame();