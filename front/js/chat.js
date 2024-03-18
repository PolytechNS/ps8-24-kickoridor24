async function envoyerChat(){
    const message = document.getElementById("messageInput").value;
    var username = getCookie("username");
    var ami = document.getElementById("nomAmiID").textContent;

    const formDataJSON = {};
    formDataJSON["message"] = message;
    formDataJSON["username"] = username;
    formDataJSON["ami"] = ami;
    try {
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        })
                document.getElementById('messageInput').value = "";
                //ajoute dans la class chatAmi une div avec la class mesMsg qui contien elle meme un p avec la classe msgMoi et le message en contenu
                var div = document.createElement("div");
                div.classList.add("mesMsg");
                var p = document.createElement("p");
                p.classList.add("msgMoi");
                p.textContent = message;
                div.appendChild(p);
                document.getElementById("chatAmiID").appendChild(div);
                scrollToBott();

    } catch (e) {
        alert(e.message);
    }
}