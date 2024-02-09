function redirectToSignup() {
    window.location.href = "signup.html";
}

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
            alert('Connexion échouée !')
        }else if(response.ok){
            document.cookie = "username=" + formDataJSON.username + ";expires=Sat, 10 Feb 2024 23:59:59 UTC;path=/";
            alert('Connexion réussie !');
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert(error.message);
    }
});

function getUsername(){
    let username = document.cookie.split("username=")[1];
    if(username !== undefined){
        return username.split(";")[0];
    }
    return null;
}