document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
       showMessage()
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

        alert('Inscription réussie !');
        window.location.href = 'login.html';
    } catch (error) {
        console.log(error.message);
    }
});
function showMessage(){
    document.getElementById("resultatSignUpDIV").style.display = "flex";
    document.getElementById("signup").disabled = true;
}
function hideMessage(){
    document.getElementById("resultatSignUpDIV").style.display = "none";
    document.getElementById("signup").disabled = false;
}