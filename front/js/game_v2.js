const socket = io('/api/game');

let activePlayer = 'playerA';
const wrapper = document.querySelector('.wrapper');
var cells = [];
let player1Position;
let player2Position;
var nbWallPlayerA = 10;
var nbWallPlayerB = 10;

socket.on('newGame', (gameState1) => {
    console.log('New game received: ', gameState1);


    for (i = 1; i <= 289; i++) {
        var newDiv = document.createElement('div');
        newDiv.textContent = ' ';
        if (i > 0 && i < 18) {
            if (!(i % 2 === 0)){
                newDiv.classList.add('top-row');
            }
        } else if (i > 272 && i <= 289) {
            if (!(i % 2 === 0)){
                newDiv.classList.add('bot-row');
            }
        }
        if (!(Math.floor((i - 1) / 17) % 2 === 0)) {
            newDiv.classList.add('odd-row');
        }
        if (!(Math.floor((i - 1) % 17) % 2 === 0)) {
            newDiv.classList.add('odd-col');
        } else if (!(newDiv.classList.contains('odd-row'))) {
            newDiv.classList.add('cell');
        }
        newDiv.setAttribute('id', i);

        if (!(newDiv.classList.contains('odd-row') || newDiv.classList.contains('odd-col'))) {
            if (i > 0 && i <= 119) {
                newDiv.setAttribute('visibility', '-1');
            } else if (i >= 137 && i <= 153) {
                newDiv.setAttribute('visibility', '0');
            } else if (i >= 171 && i <= 289) {
                newDiv.setAttribute('visibility', '1');
            }
        }

        cells.push(newDiv);
        wrapper.appendChild(newDiv);

    }

    if(getCookie("typeDePartie") ==="resumeGame"){
        //TODO
        //loadGame();
    }
    else{
        setUpGame(gameState1);
    }
});

function setUpGame(gameState) {
    if(gameState === undefined){

    }else{
        gState = gameState;
    }
    hideAntiCheat();
    hideValider();
    if(getCookie("typeDePartie") === "enLigne" ||getCookie("username") == null)
        hideSauvegarder();
    if(activePlayer==="playerA") {
        hideForfaitB();
        showForfaitA();
    }
    else{
        hideForfaitA();
        showForfaitB();
    }

    document.getElementById('currentPlayer').textContent = `Tour : ${activePlayer}`;
    document.querySelector('#nbWallPlayerA').innerText = "Murs restants : " + nbWallPlayerA;
    document.querySelector('#nbWallPlayerB').innerText = "Murs restants : " + nbWallPlayerB;
    cells[player1Position].classList.add('playerA');
    cells[player2Position].classList.add('playerB');

    hideAntiCheat();
    hideValider();
    lanePlayerA = document.getElementsByClassName('bot-row');
    lanePlayerB = document.getElementsByClassName('top-row');

    //TODO
    //dijkstraVisitedNode = [];
    activateFog();

    if(tour<=200)
        document.getElementById('nbTour').textContent = `Tour : n°${tour}`;

    cells.forEach((cell, index) => {
        if (cell.classList.contains('odd-row') || cell.classList.contains('odd-col'))
            cell.addEventListener('click', () => handleWall(index));
        else
            cell.addEventListener('click', () => movePlayer(index));
    });

    if (tour === 202) {
        const botRows = document.querySelectorAll('.bot-row');
        botRows.forEach(row => row.classList.add('first-turn'));

        // Afficher le message pour le premier tour
        const message = document.createElement('div');
        message.innerHTML = '1er tour !<br> Placez votre joueur sur une case de la ligne de départ';
        message.classList.add('message');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        wrapper.appendChild(message);
        //si une case de top-row est cliquée alors on move le joueur
        botRows.forEach(row => row.addEventListener('click', () => movePlyerFirstTurn(row.getAttribute('id') - 1)));

    }
    checkTour201();
    checkCrossing(player1Position,player2Position);
}

function hideAntiCheat() {
    document.querySelector('.anti-cheat').style.display = 'none';
    wrapper.style.display = 'grid';
    //TODO
    //setTimeout(checkNoMove,3000);
}



function hideValider() {
    document.querySelector('#validerA').style.display = 'none';
    document.querySelector('#validerB').style.display = 'none';
    murAPose = new Array(3);
}

function showValider() {
    var id = "#valider";
    if (activePlayer === 'playerA')
        id += "A";
    else
        id += "B";
    document.querySelector(id).style.display = 'grid';

}

function hideSauvegarder(){
    document.querySelector('.sauvegarder').style.display = 'none';
}
function hideForfaitA(){
    document.querySelector('#forfaitA').style.display = 'none';
}

function hideForfaitB(){
    document.querySelector('#forfaitB').style.display = 'none';
}
function showForfaitA(){
    document.querySelector('#forfaitA').style.display = 'grid';
}

function showForfaitB(){
    document.querySelector('#forfaitB').style.display = 'grid';
}
