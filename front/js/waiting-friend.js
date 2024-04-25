document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    const friend = urlParams.get('friend');
    const socket = io('/api/game');
    const title = document.getElementById('title');
    title.innerHTML = "Attente de la réponse de " + friend;
});