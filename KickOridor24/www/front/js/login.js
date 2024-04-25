function redirectToSignup() {
    window.location.href = "signup.html";
}
/*document.getElementById('loginForm').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') { // Vérification si la touche pressée est "Entrée"

       // Empêche le comportement par défaut de la touche "Entrée" dans le champ d'entrée
        document.getElementById('loginForm').submit(); // Soumet le formulaire
    }
});*/
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataJSON = {};

    formData.forEach((value, key) => {
        formDataJSON[key] = value;
    });

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            navigator.vibrate([200,100,200]);
            showMessage();
        }else if(response.ok){
            //setCookie("username",formDataJSON.username,7);
            localStorage.setItem('username', formDataJSON.username);
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.log(error.message);
    }
});

function getUsername(){
    let username =localStorage.getItem("username");
    if(username !== undefined){
        return username;
    }
    return null;
}

function showMessage(){
    document.getElementById("resultatConnexionDIV").style.display = "flex";
    document.getElementById("signup").disabled = true;
    document.getElementById("login").disabled = true;
}
function hideMessage(){
    document.getElementById("resultatConnexionDIV").style.display = "none";
    document.getElementById("signup").disabled = false;
    document.getElementById("login").disabled = false;
}