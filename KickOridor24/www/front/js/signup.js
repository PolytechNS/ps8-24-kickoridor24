document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showMessage("Les mots de passe ne correspondent pas");
        return;
    }

    const username = document.getElementById('username').value; // supposons que votre champ d'inscription s'appelle "username"

    if (username.length > 12) {
        showMessage("Le nom d'utilisateur ne peut pas dépasser 12 caractères");
        return;
    }

    const formData = new FormData(event.target);
    const formDataJSON = {};

    formData.forEach((value, key) => {
        formDataJSON[key] = value;
    });

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            var err = await response.text();
            throw new Error('Une erreur est survenue lors de l\'inscription : ' + err);
        }
        showMessage('Inscription réussie !');
        console.log('Inscription réussie !');
        window.location.href = 'login.html';
    } catch (error) {
        showMessage("Un utilisateur possède déjà ce nom");
        console.log(error.message);
    }
});

function showMessage(txt){
    var div = document.getElementById("resultatSignUpDIV");
    div.style.display = "flex";
    div.getElementsByTagName("p")[0].innerText = txt;
    document.getElementById("signup").disabled = true;
}

function hideMessage(){
    document.getElementById("resultatSignUpDIV").style.display = "none";
    document.getElementById("signup").disabled = false;
}
