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
        }else{
            alert('Connexion réussie !');
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert(error.message);
    }
});