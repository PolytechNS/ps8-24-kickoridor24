document.getElementById("signup").addEventListener("click", function(e) {
    var mail = document.getElementById("mail").value;
    var password = document.getElementById("password").value;
    var passwordConf = document.getElementById("passwordConf").value;
    var username = document.getElementById("username").value;

    console.log(mail,passwordConf,password,username);

    if (password != passwordConf) {
        console.log("Passwords don't match");
        return;
    }else {
        const date = {
            mail: mail,
            password: password,
            username: username
        }
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(date),
        })
    }
});
