const socket = io('/api/game');

// Sélectionnez la div wrapper
const wrapper = document.querySelector('.wrapper');
var validGrid = [];
var grid = [];
let isClickedCell = false;
let murAPose = new Array(3);
var lanePlayerA;
var lanePlayerB;
var partieChargee = false;
var gState;
var board = [];

let i;
var tmpLigne = [];
let n;
var cellsString = [];
var cellsGrid = [];

class cellule {
    constructor(id, classes, visibilite) {
        this.class = classes;
        this.id = id;
        this.visibility = visibilite;
    }
}

class gameBDD {
    constructor(username, board, tour, typeDePartie) {
        this.username = username;
        this.board = board;
        this.tour = tour;
        this.typeDePartie = typeDePartie;
    }
}

class gameState {
    constructor(ownWalls, opponentWalls, board) {
        this.ownWalls = ownWalls;
        this.opponentWalls = opponentWalls;
        this.board = board;
    }
}

let newMove = {
    player: '',
    type: '',
    position: ''
};

/**--------------- VARIABLE GLOBAL --------------------**/
let cells = [];
let playerAWalls = [];
let playerBWalls = [];
let nbWallPlayerA = 10;
let nbWallPlayerB = 10;
let activePlayer = 'playerA'
let tour = 202;
let firstTurn = true;
let player1Position = 280;
let player2Position = 8;
var dernierTourB = false;
/**--------------- SETUP GAME --------------------**/
var gameState1 = new gameState(playerAWalls,playerBWalls,board);
//TODO JE SAIS OU IL FAUT LA METTRE
//setup(1);

socket.on('setupGame', () => {
    for (i = 0; i < 289; i = i + 2) {
        if (i > 135) {
            n = 0;
        } else {
            n = -1;
        }
        if (i % 34 === 0 && i !== 0) {
            board.push(tmpLigne);
            tmpLigne = [];
        } else if (i % 16 === 0 && i !== 0) {
            i = i + 16;
        }
        tmpLigne.push(n);
    }
    board.push(tmpLigne);

    socket.emit('getPlayersPosition');
    socket.on('getPlayersPositionResponse', (player1Position, player2Position) => {
        cellsString = [];
        cellsGrid = [];
        for (i = 1; i <= 289; i++) {
            var type = '';
            var newDiv = document.createElement('div');
            newDiv.textContent = ' ';
            grid[i] = 1;
            if (i > 0 && i < 18) {
                if (!(i % 2 === 0)) {
                    newDiv.classList.add('top-row');
                    type += 'top-row,';
                }
            } else if (i > 272 && i <= 289) {
                if (!(i % 2 === 0)) {
                    newDiv.classList.add('bot-row');
                    type += 'bot-row,';
                }
            }
            if (!(Math.floor((i - 1) / 17) % 2 === 0)) {
                newDiv.classList.add('odd-row');
                type += 'odd-row,';
            }
            if (!(Math.floor((i - 1) % 17) % 2 === 0)) {
                newDiv.classList.add('odd-col');
                type += 'odd-col,';
            } else if (!(newDiv.classList.contains('odd-row'))) {
                newDiv.classList.add('cell');
                type += 'cell,';
                grid[i] = 0;
            }
            newDiv.setAttribute('id', i);
            type += 'id:' + i + ',';

            if (!(newDiv.classList.contains('odd-row') || newDiv.classList.contains('odd-col'))) {
                if (i > 0 && i <= 119) {
                    newDiv.setAttribute('visibility', '-1');
                    type += 'visibility:-1';
                } else if (i >= 137 && i <= 153) {
                    newDiv.setAttribute('visibility', '0');
                    type += 'visibility:0';
                } else if (i >= 171 && i <= 289) {
                    newDiv.setAttribute('visibility', '1');
                    type += 'visibility:1';
                }
            }

            if (i === player1Position || i === player2Position) {
                validGrid.push(1);
            } else {
                validGrid.push(0);
            }
            //cells.push(newDiv);
            cellsString.push(type);
            cellsGrid.push(newDiv)
            wrapper.appendChild(newDiv);
        }
        socket.emit('addCellFirtTime', cellsString);
    });

    socket.on('setupTheGame', () => {
        if (getCookie("typeDePartie") === "resumeGame") {
            loadGame();
        } else {
            setUpGame();
        }
    });
});


function createDivsWithClassesAndAttributes(classLists) {
    return classLists.map(classList => {
        // Création de la div
        let div = document.createElement('div');

        // Séparation des classes et des attributs
        classList.split(',').forEach(item => {
            // Ajout des classes à la div
            if (item.trim() === 'top-row') {
                div.classList.add('top-row');
            }
            if (item.trim() === 'bot-row') {
                div.classList.add('bot-row');
            }
            if (item.trim() === 'cell') {
                div.classList.add('cell');
            }
            if (item.trim() === 'odd-row') {
                div.classList.add('odd-row');
            }
            if (item.trim() === 'odd-col') {
                div.classList.add('odd-col');
            }

            // Ajout des attributs à la div
            if (item.includes(':')) {
                let [key, value] = item.split(':');
                div.setAttribute(key.trim(), value.trim());
            }
        });

        return div;
    });
}

function getClassesAndAttributesFromDivs(divs) {
    return divs.map(div => {
        let classList = Array.from(div.classList).join(' ');

        let attributes = Array.from(div.attributes)
            .map(attr => `${attr.name}:${attr.value}`)
            .join(',');

        let result = classList;

        if (attributes) {
            result += ',' + attributes;
        }

        return result;
    });
}

function mettreAJourTableau(tableau1, tableau2) {
    // Vérifier que les deux tableaux ont la même longueur
    if (tableau1.length !== tableau2.length) {
        console.error("Les tableaux n'ont pas la même longueur.");
        return;
    }
    // Parcourir le tableau1
    tableau1.forEach(div1 => {
        let divID = div1.getAttribute('id');
        let div2 = tableau2.find(div => div.getAttribute('id') === divID);

        if (div2) {
            div1.classList = div2.classList;

            for (let i = 0; i < div2.attributes.length; i++) {
                let attr = div2.attributes[i];
                div1.setAttribute(attr.name, attr.value);
            }

        } else {
            console.warn(`Le div avec l'ID ${divID} n'a pas été trouvé dans le tableau2.`);
        }
    });
}

function setUpGame() {
    saveToBack();
    socket.emit('setUpGame');
    socket.on('setUpGameResponse', (activePlayer, nbWallPlayerA, nbWallPlayerB, player1Position, player2Position, tour, cells) => {
        cells = createDivsWithClassesAndAttributes(cells);


        hideAntiCheat();
        HideVictoire();

        hideValider();

        if (getCookie("typeDePartie") === "enLigne" || getCookie("username") == null)
            hideSauvegarder();
        if (activePlayer === "playerA") {
            hideForfaitB();
            showForfaitA();
        } else {
            hideForfaitA();
            showForfaitB();
        }

        document.getElementById('currentPlayer').textContent = `Tour : ${activePlayer}`;
        document.querySelector('#nbWallPlayerA').innerText = "Murs restants : " + nbWallPlayerA;
        document.querySelector('#nbWallPlayerB').innerText = "Murs restants : " + nbWallPlayerB;

        cells[player1Position].classList.add('playerA');

        cells[player2Position].classList.add('playerB');

        hideAntiCheat();
        HideVictoire();

        hideValider();

        lanePlayerA = [];
        lanePlayerB = [];


        cellsGrid.forEach((div) => {
            if (div.classList.contains('bot-row')) {
                lanePlayerA.push(div);
            } else if (div.classList.contains('top-row')) {
                lanePlayerB.push(div);
            }
        });

        cells = cellsGrid;

        dijkstraVisitedNode = [];
        activateFog(cells);

        if (tour <= 200)
            document.getElementById('nbTour').textContent = 'Tour : n°' + (200 -(tour - 1));


        mettreAJourTableau(cellsGrid, cells);
        cells.forEach((cell, index) => {

            if (cell.classList.contains('odd-row') || cell.classList.contains('odd-col')){
                cell.addEventListener('click', () => handleWall(index));
        }
            else
                cell.addEventListener('click', () => movePlayer(index));
        });


        if (tour === 202) {

            let botRows = [];
            lanePlayerA.forEach(row =>
                row.classList.add('first-turn')
            );

            mettreAJourTableau(cellsGrid, cells);

            cellsGrid.forEach((div) => {
                if (div.classList.contains('bot-row')) {
                    botRows.push(div);
                }
            });

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

        mettreAJourTableau(cellsGrid, cells);
        checkTour201();
        if(tour < 199) {
            checkCrossing(player1Position, player2Position);
        }
    });
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);

// Définir la règle CSS
    var cssA = '.playerA { background-image: url("'+ photoDeProfil +'"); }';
    var cssB;
    if(photoDeProfil == "images/photoProfil/Pedri.png"){
        cssB = '.playerB { background-image: url("images/photoProfil/Mitroglu.png"); }';
    }else{
        cssB = '.playerB { background-image: url("images/photoProfil/Pedri.png"); }';
    }

    style.appendChild(document.createTextNode(cssA));
    style.appendChild(document.createTextNode(cssB));
    socket.emit('endSetupGame');
}

/*--------------- END SETUP GAME --------------------*/


/*--------------- LOGIC OF THE GAME --------------------*/

socket.on('game', (player1Pos, player2Pos, cels, pAWalls, pBWalls, nbWallPA, nbWallPB, activeP, lap, first, dernierLapB) => {
    player1Position = player1Pos;
    player2Position = player2Pos;
    cells = createDivsWithClassesAndAttributes(cels);
    playerAWalls = pAWalls;
    playerBWalls = pBWalls;
    nbWallPlayerA = nbWallPA;
    nbWallPlayerB = nbWallPB;
    activePlayer = activeP;
    tour = lap;
    firstTurn = first;
    dernierTourB = dernierLapB;
});

function changeVisibility(rigthCell, leftCell, player, horizontale) {
    rigthCellNumber = rigthCell.getAttribute('id');
    leftCellNumber = leftCell.getAttribute('id');
    if (horizontale) {
        topRightCell = cells[rigthCellNumber - 18];
        botRightCell = cells[parseInt(rigthCellNumber) + 16];
        topLeftCell = cells[leftCellNumber - 18];
        botLeftCell = cells[parseInt(leftCellNumber) + 16];

        topRightCellPlus1 = cells[rigthCellNumber - 52];
        botRightCellPlus1 = cells[parseInt(rigthCellNumber) + 50];
        topLeftCellPlus1 = cells[leftCellNumber - 52];
        botLeftCellPlus1 = cells[parseInt(leftCellNumber) + 50];
    } else {
        topRightCell = cells[parseInt(rigthCellNumber)]
        botRightCell = cells[parseInt(rigthCellNumber) - 2];
        topLeftCell = cells[parseInt(leftCellNumber)];
        botLeftCell = cells[parseInt(leftCellNumber) - 2];

        topRightCellPlus1 = cells[parseInt(rigthCellNumber) + 2];
        botRightCellPlus1 = cells[parseInt(rigthCellNumber) - 4];
        topLeftCellPlus1 = cells[parseInt(leftCellNumber) + 2];
        botLeftCellPlus1 = cells[parseInt(leftCellNumber) - 4];
    }
    if (player == "playerB") {

        if (topRightCell != undefined && topRightCell.hasAttribute('visibility'))
            topRightCell.setAttribute('visibility', topRightCell.getAttribute('visibility') - 2);

        if (botRightCell != undefined && botRightCell.hasAttribute('visibility'))
            botRightCell.setAttribute('visibility', botRightCell.getAttribute('visibility') - 2);
        if (topLeftCell != undefined && topLeftCell.hasAttribute('visibility'))
            topLeftCell.setAttribute('visibility', topLeftCell.getAttribute('visibility') - 2);
        if (botLeftCell != undefined && botLeftCell.hasAttribute('visibility'))
            botLeftCell.setAttribute('visibility', botLeftCell.getAttribute('visibility') - 2);

        if (topRightCellPlus1 != undefined && topRightCellPlus1.hasAttribute('visibility'))
            topRightCellPlus1.setAttribute('visibility', topRightCellPlus1.getAttribute('visibility') - 1);
        if (botRightCellPlus1 != undefined && botRightCellPlus1.hasAttribute('visibility'))
            botRightCellPlus1.setAttribute('visibility', botRightCellPlus1.getAttribute('visibility') - 1);
        if (topLeftCellPlus1 != undefined && topLeftCellPlus1.hasAttribute('visibility'))
            topLeftCellPlus1.setAttribute('visibility', topLeftCellPlus1.getAttribute('visibility') - 1);
        if (botLeftCellPlus1 != undefined && botLeftCellPlus1.hasAttribute('visibility'))
            botLeftCellPlus1.setAttribute('visibility', botLeftCellPlus1.getAttribute('visibility') - 1);

    } else if (player == "playerA") {
        if (topRightCell != undefined && topRightCell.hasAttribute('visibility'))
            topRightCell.setAttribute('visibility', parseInt(topRightCell.getAttribute('visibility')) + 2);
        if (botRightCell != undefined && botRightCell.hasAttribute('visibility'))
            botRightCell.setAttribute('visibility', parseInt(botRightCell.getAttribute('visibility')) + 2);
        if (topLeftCell != undefined && topLeftCell.hasAttribute('visibility'))
            topLeftCell.setAttribute('visibility', parseInt(topLeftCell.getAttribute('visibility')) + 2);
        if (botLeftCell != undefined && botLeftCell.hasAttribute('visibility'))
            botLeftCell.setAttribute('visibility', parseInt(botLeftCell.getAttribute('visibility')) + 2);

        if (topRightCellPlus1 != undefined && topRightCellPlus1.hasAttribute('visibility'))
            topRightCellPlus1.setAttribute('visibility', parseInt(topRightCellPlus1.getAttribute('visibility')) + 1);
        if (botRightCellPlus1 != undefined && botRightCellPlus1.hasAttribute('visibility'))
            botRightCellPlus1.setAttribute('visibility', parseInt(botRightCellPlus1.getAttribute('visibility')) + 1);
        if (topLeftCellPlus1 != undefined && topLeftCellPlus1.hasAttribute('visibility'))
            topLeftCellPlus1.setAttribute('visibility', parseInt(topLeftCellPlus1.getAttribute('visibility')) + 1);
        if (botLeftCellPlus1 != undefined && botLeftCellPlus1.hasAttribute('visibility'))
            botLeftCellPlus1.setAttribute('visibility', parseInt(botLeftCellPlus1.getAttribute('visibility')) + 1);
    }
    mettreAJourTableau(cellsGrid, cells);
}

function validerWall() {
    const clickedCell = cells[murAPose[0]];
    const rightCell = cells[murAPose[1]];
    const leftCell = cells[murAPose[2]];

    changeVisibilityPlayer(true, player1Position, "playerA");
    changeVisibilityPlayer(true, player2Position, "playerB");


    const wallPosition = murAPose[0] - 18;

    clickedCell.classList.remove('wallTMP');
    clickedCell.classList.remove('rotation');
    rightCell.classList.remove('wallTMP');
    leftCell.classList.remove('wallTMP');
    var mur = 'wall';
    if (activePlayer === 'playerA')
        mur += 'A';
    else
        mur += 'B';
    clickedCell.classList.add(mur);
    rightCell.classList.add(mur);
    leftCell.classList.add(mur);
    var horizontale = false;
    if (murAPose[1] - murAPose[0] === 1) {
        horizontale = true;
    }
    if (activePlayer === 'playerA') {
        newMove.player = 'playerA';
        newMove.type = 'wall';
        newMove.position = murAPose;


        const newWallA = [convertPositionToGameState(wallPosition), horizontale ? 0 : 1];
        playerAWalls.push(newWallA);


    } else {
        newMove.player = 'playerB';
        newMove.type = 'wall';
        newMove.position = murAPose;


        const newWallB = [convertPositionToGameState(wallPosition), horizontale ? 0 : 1];
        playerBWalls.push(newWallB);

    }
    changeVisibilityPlayer(false, player1Position, "playerA");
    changeVisibilityPlayer(false, player2Position, "playerB");
    changeVisibility(rightCell, leftCell, activePlayer, horizontale);

    saveToBack();

    changeActivePlayer();
    hideValider();

}

function convertPositionToGameState(position) {
    let ligne = Math.floor(position % 17 / 2);
    let colonne = Math.floor(position / 17) / 2;
    colonne = 8 - colonne;
    colonne = colonne + 1;
    ligne = ligne + 1;
    return ligne + "" + colonne;

}

function convertGameStateToPosition(gameState) {
    let ligne = parseInt(gameState.charAt(0)) - 1;
    let colonne = parseInt(gameState.charAt(1)) - 1;
    colonne = 8 - colonne;
    colonne = colonne * 2;
    ligne = ligne * 2;
    return colonne * 17 + ligne;
}

function declarerForfait() {
    if (activePlayer === "playerA") {
        victoire("Vous avez déclarer forfait \n Player B a gagné !");
    } else {
        victoire("Vous avez déclarer forfait \n Player A a gagné !");
    }
}

async function sauvegarderLaPartie() {
    await supprimerAnciennePartie(getUsername());
    if (murAPose[0] != undefined)
        annulerWall();
    cells.forEach(cell => cell.classList.remove('possible-move'));
    var tab = construireEtatPartie();
    var etat = new gameBDD(getUsername(), tab, tour, getCookie("typeDePartie"));
    const formDataJSON = {};
    formDataJSON["username"] = etat.username;
    formDataJSON["board"] = etat.board;
    formDataJSON["tour"] = etat.tour;
    formDataJSON["typeDePartie"] = etat.typeDePartie;
    try {
        const response = await fetch('/api/gameSave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });
        if (!response.ok) {
            throw new Error('Une erreur est survenue lors de la sauvegarde de la partie.');
        }
        alert('Partie sauvegardée !');
        window.location.href = 'index.html';
    } catch (e) {
        alert(e.message);
    }

}


function construireEtatPartie() {
    var tab = [];
    for (var i = 0; i < cells.length; i++) {
        tab.push(new cellule(cells[i].getAttribute('id'), cells[i].classList, cells[i].getAttribute('visibility')))
    }
    return tab;
}

async function loadGame() {

    var etatPartie = await retrieveGameBDD(getUsername());


    tour = etatPartie["tour"];
    if (tour == 202 || tour == 201) {
        firstTurn = true;
    } else {
        firstTurn = false;
    }
    if (tour % 2 == 0) {
        activePlayer = "playerA";
    } else {
        activePlayer = "playerB";
    }

    loadBoard(etatPartie["board"]);


    setCookie("typeDePartie", etatPartie["typeDePartie"], 7);

    setUpGame();
    partieChargee = true;
}

async function retrieveGameBDD(username) {
    const formDataJSON = {};
    formDataJSON["username"] = username;
    try {
        const response = await fetch('/api/gameRetrieve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau ou HTTP: ' + response.status);
            }

            return response.json(); // Convertit la réponse en JSON
        })
            .then(data => {

                return data;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
        return response;
    } catch (e) {
        alert(e.message);
    }
}

function loadBoard(tab) {
    var wallA = 0;
    var wallB = 0;

    //cells = new Array();
    while (wrapper.firstChild)
        wrapper.removeChild(wrapper.firstChild);

    for (var i = 0; i < tab.length; i++) {
        var newDiv = document.createElement('div');
        const classes = Object.values(tab[i]["class"]);
        classes.forEach(className => {
            newDiv.classList.add(className);
        });
        if (classes.includes("playerA") || classes.includes("playerAFog")) {
            player1Position = i;
        }
        if (classes.includes("playerB") || classes.includes("playerBFog")) {
            player2Position = i;
        }
        if (classes.includes("wallA")) {
            wallA++;
        }
        if (classes.includes("wallB")) {
            wallB++;
        }

        newDiv.setAttribute('id', tab[i]["id"]);
        if (tab[i]["visibility"] != null)
            newDiv.setAttribute('visibility', tab[i]["visibility"]);


        cells.push(newDiv);

        wrapper.appendChild(newDiv);
    }


    nbWallPlayerA = 10 - (wallA / 3);
    nbWallPlayerB = 10 - (wallB / 3);
    cellsGrid = cells;
}

/*--------------- FONCTION GLOBALE --------------------*/
function hideAntiCheat() {
    document.querySelector('.anti-cheat').style.display = 'none';
    wrapper.style.display = 'grid';
    setTimeout(checkNoMove, 3000);
}

function hideValider() {
    document.querySelector('#validerA').style.display = 'none';
    document.querySelector('#validerB').style.display = 'none';
    murAPose = new Array(3);
}

function hideSauvegarder() {
    document.querySelector('.sauvegarder').style.display = 'none';
}

function hideForfaitA() {
    document.querySelector('#forfaitA').style.display = 'none';
}

function hideForfaitB() {
    document.querySelector('#forfaitB').style.display = 'none';
}

function showForfaitA() {
    document.querySelector('#forfaitA').style.display = 'grid';
}

function showForfaitB() {
    document.querySelector('#forfaitB').style.display = 'grid';
}

function checkCrossing(playerAPosition, playerBPosition) {

    var gagneA = false;
    var gagneB = false;
    for (var i = 0; i < lanePlayerB.length; i++) {

        if (lanePlayerB[i].getAttribute('id') == cells[playerAPosition].getAttribute('id')) {

            if (dernierTourB) {
                gagneA = true;

            }
            if (!dernierTourB) {
                dernierTourB = true;
            }
        }
    }
    for (var i = 0; i < lanePlayerA.length; i++) {

        if (lanePlayerA[i].getAttribute('id') == cells[playerBPosition].getAttribute('id')) {
            gagneB = true;
        }
    }
    if ((gagneA && gagneB) || tour === 0) {
        victoire("match nul !");

    } else if (gagneA) {
        victoire("PlayerA");

    } else if (gagneB) {
        victoire("PlayerB");

    }
}

function victoire(txt) {
    //alert(txt);
    showVictoire(txt);
    if (partieChargee)
        supprimerAnciennePartie(getUsername());
   // window.location.href = 'index.html';
}
function showVictoire(txt){
    document.querySelector('.finDePartie').style.display = 'flex';
    const divMid = document.getElementById("finMiddle");
    if(txt == "match nul !"){
        divMid.getElementsByTagName('h2')[0].textContent = txt;
        divMid.getElementsByTagName('img')[0].src = "images/draw.gif";
    }
    else {
        divMid.getElementsByTagName('h2')[0].textContent = txt + " remporte la partie";

        if (txt == "playerA") {
            if (getCookie("username") != null) {
                divMid.getElementsByTagName('h2')[0].textContent = getCookie("username") + " remporte la partie";
            }
            if (celebrationBDD != null) {
                divMid.getElementsByTagName('img')[0].src = celebrationBDD + '.gif';

            }
        }
    }
    document.querySelector('.anti-cheat').style.display = 'none';
    wrapper.style.display = 'none';
}
function HideVictoire(){
    document.querySelector('.finDePartie').style.display = 'none';

}
async function supprimerAnciennePartie(user) {
    const formDataJSON = {};
    formDataJSON["username"] = user;
    try {
        const response = await fetch('/api/gameDelete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });
    } catch (e) {
        alert(e.message);
    }
}

function checkTour201() {
    if (tour === 201) {
        firstTurn = true;
        socket.emit('updateFirstTurn', firstTurn);
        const topRows = document.querySelectorAll('.top-row');
        topRows.forEach(row => row.classList.add('first-turn'));

        // Afficher le message pour le premier tour
        const message = document.createElement('div');
        message.innerHTML = '1er tour !<br> Placez votre joueur sur une case de la ligne de départ';
        message.classList.add('message');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        wrapper.appendChild(message);
        //si une case de top-row est cliquée alors on move le joueur

        topRows.forEach(row => row.addEventListener('click', () => movePlyerFirstTurn(row.getAttribute('id') - 1)));
    }
}

function activateFog(cells) {
    if (activePlayer == "playerB") {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].getAttribute('visibility') <= "0") {
                cells[i].classList.remove('fog');
            }
            if (i === player2Position) {
                cells[i].classList.add('playerB');
                cells[i].classList.remove('playerBFog');
            }
            if (cells[i].getAttribute('visibility') > "0") {
                cells[i].classList.add('fog');
                if (cells[i].classList.contains('playerA') && cells[i].classList.contains('fog') && !checkJoueurColle()) {
                    cells[i].classList.remove('playerA');
                    cells[i].classList.add('playerAFog');
                }
            }
        }
    } else if (activePlayer == "playerA") {
        for (let i = 0; i < cells.length; i++) {
            if (i === player1Position) {
                cells[i].classList.add('playerA');
                cells[i].classList.remove('playerAFog');
            }
            if (cells[i].getAttribute('visibility') >= "0") {
                cells[i].classList.remove('fog');
            }
            if (cells[i].getAttribute('visibility') < "0") {
                cells[i].classList.add('fog');
                if (cells[i].classList.contains('playerB') && cells[i].classList.contains('fog') && !checkJoueurColle()) {
                    cells[i].classList.remove('playerB');
                    cells[i].classList.add('playerBFog');
                }
            }
        }
    }
    mettreAJourTableau(cellsGrid, cells);
}

function checkJoueurColle() {
    var res = player2Position - player1Position;
    var bool;
    switch (res) {
        case 2 :
            if (!cells[player1Position + 1].classList.value.match(/\bwall[AB]\b/)) {
                bool = true;
            }
            break;
        case -2 :
            if (!cells[player1Position - 1].classList.value.match(/\bwall[AB]\b/)) {
                bool = true;
            }
            break;
        case 34 :
            if (!cells[player1Position + 17].classList.value.match(/\bwall[AB]\b/)) {
                bool = true;
            }
            break;
        case -34 :
            if (!cells[player1Position - 17].classList.value.match(/\bwall[AB]\b/)) {
                bool = true;
            }
            break;
        default :
            bool = false;
            break;
    }
    return bool;
}

function handleWall(cellIndex) {

    const row = Math.floor(cellIndex / 17);
    const col = cellIndex % 17;

    const clickedCell = cells[cellIndex];
    const rightCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];


    if ((tour === 202 && firstTurn) || (tour === 201 && firstTurn)) {
        alert("Vous ne pouvez pas poser de mur au premier tour !");
        return;
    }


    const upCell = cells[cellIndex - 17];
    const downCell = cells[cellIndex + 17];

    if (clickedCell.classList.contains("rotation")) {

        return rotationWall(cellIndex);
    }
    var bougerMur = removeWallTmp(clickedCell);
    if (bougerMur && activePlayer === 'playerA') nbWallPlayerA++;
    else if (bougerMur && activePlayer === 'playerB') nbWallPlayerB++;
    if (isClickedCell) {
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    }
    if ((activePlayer === 'playerA' && nbWallPlayerA === 0) || (activePlayer === 'playerB' && nbWallPlayerB === 0)) {
        alert("Vous n'avez plus de murs !")
        return;
    }


    var poser = false;
    //pour placer a l'horizontale

    if ((clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && !clickedCell.classList.value.match(/\bwall[AB]\b/) && !rightCell.classList.value.match(/\bwall[AB]\b/) && !leftCell.classList.value.match(/\bwall[AB]\b/))
        //||
        // (clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && ( upCell.classList.value.match(/\bwall[AB]\b/) || downCell.classList.value.match(/\bwall[AB]\b/)) && !rightCell.classList.value.match(/\bwall[AB]\b/) && !leftCell.classList.value.match(/\bwall[AB]\b/))){// soit cliquer a cote d'un mur horizontale
    ) {

        clickedCell.classList.add('wallTMP');
        clickedCell.classList.add('rotation');
        murAPose[0] = cellIndex;
        if (col < 16 && !rightCell.classList.value.match(/\bwall[AB]\b/) && (rightCell.classList.contains('odd-row') || rightCell.classList.contains('odd-col')))
            rightCell.classList.add('wallTMP');
        murAPose[1] = cellIndex + 1;
        if (col > 0 && !leftCell.classList.value.match(/\bwall[AB]\b/) && (leftCell.classList.contains('odd-row') || leftCell.classList.contains('odd-col')))
            leftCell.classList.add('wallTMP');
        murAPose[2] = cellIndex - 1;
        poser = true;
    }
    //pour placer en verticale
    else if ((clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col'))
        && !clickedCell.classList.value.match(/\bwall[AB]\b/) && (rightCell.classList.value.match(/\bwall[AB]\b/) || leftCell.classList.value.match(/\bwall[AB]\b/))
        && !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/)) {
        clickedCell.classList.add('wallTMP');
        clickedCell.classList.add('rotation');
        //clickedCell.classList.add('jambeMur');
        murAPose[0] = cellIndex;
        if (col < 16 && !upCell.classList.value.match(/\bwall[AB]\b/) && (upCell.classList.contains('odd-row') || upCell.classList.contains('odd-col')))
            upCell.classList.add('wallTMP');
        murAPose[1] = cellIndex - 17;
        if (col > 0 && !downCell.classList.value.match(/\bwall[AB]\b/) && (downCell.classList.contains('odd-row') || downCell.classList.contains('odd-col')))
            downCell.classList.add('wallTMP');
        murAPose[2] = cellIndex + 17;
        poser = true;
    } else if (clickedCell.classList.contains('odd-row') && !clickedCell.classList.contains('odd-col') && !clickedCell.classList.value.match(/\bwall[AB]\b/)) //la cellule est une ligne
    {
        //horizontale a droite
        if (!cells[cellIndex + 2].classList.value.match(/\bwall[AB]\b/) && cells[cellIndex + 2].classList.contains('odd-row') && !cells[cellIndex + 1].classList.value.match(/\bwall[AB]\b/)) {

            clickedCell.classList.add('wallTMP');
            murAPose[2] = cellIndex;
            if (col < 16 && !rightCell.classList.value.match(/\bwall[AB]\b/) && (rightCell.classList.contains('odd-row') || rightCell.classList.contains('odd-col'))) {
                rightCell.classList.add('wallTMP');
                rightCell.classList.add('rotation');
            }
            murAPose[0] = cellIndex + 1;
            if (!cells[cellIndex + 2].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex + 2].classList.contains('odd-row') || cells[cellIndex + 2].classList.contains('odd-col')))
                cells[cellIndex + 2].classList.add('wallTMP');
            murAPose[1] = cellIndex + 2;
            poser = true;

        }
        //horizontale a gauche
        else if (!cells[cellIndex - 2].classList.value.match(/\bwall[AB]\b/) && cells[cellIndex - 2].classList.contains('odd-row') && !cells[cellIndex - 1].classList.value.match(/\bwall[AB]\b/)) {

            clickedCell.classList.add('wallTMP');
            murAPose[1] = cellIndex;
            if (!cells[cellIndex - 2].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex - 2].classList.contains('odd-row') || cells[cellIndex - 2].classList.contains('odd-col')))
                cells[cellIndex - 2].classList.add('wallTMP');
            murAPose[2] = cellIndex - 2;
            if (col > 0 && !leftCell.classList.value.match(/\bwall[AB]\b/) && (leftCell.classList.contains('odd-row') || leftCell.classList.contains('odd-col'))) {
                leftCell.classList.add('wallTMP');
                leftCell.classList.add('rotation');
            }
            murAPose[0] = cellIndex - 1;
            poser = true;

        }
    } else if (!clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && !clickedCell.classList.value.match(/\bwall[AB]\b/)) //la cellule est une colonne
    {
        if (cells[cellIndex - 34] != undefined && !cells[cellIndex - 34].classList.value.match(/\bwall[AB]\b/) && cells[cellIndex - 34].classList.contains('odd-col') && !cells[cellIndex - 17].classList.value.match(/\bwall[AB]\b/)) {
            //verticale haut

            clickedCell.classList.add('wallTMP');
            murAPose[2] = cellIndex;
            if (!cells[cellIndex - 34].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex - 34].classList.contains('odd-row') || cells[cellIndex - 34].classList.contains('odd-col')))
                cells[cellIndex - 34].classList.add('wallTMP');
            murAPose[1] = cellIndex - 34;
            if (col > 0 && !upCell.classList.value.match(/\bwall[AB]\b/) && (upCell.classList.contains('odd-row') || upCell.classList.contains('odd-col'))) {
                upCell.classList.add('wallTMP');
                upCell.classList.add('rotation');
            }
            murAPose[0] = cellIndex - 17;
            poser = true;
        } else if (cells[cellIndex + 34] != undefined && !cells[cellIndex + 34].classList.value.match(/\bwall[AB]\b/) && cells[cellIndex + 34].classList.contains('odd-col') && !cells[cellIndex + 17].classList.value.match(/\bwall[AB]\b/)) {
            //verticale bas

            clickedCell.classList.add('wallTMP');
            murAPose[1] = cellIndex;
            if (!cells[cellIndex + 34].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex + 34].classList.contains('odd-row') || cells[cellIndex + 34].classList.contains('odd-col')))
                cells[cellIndex + 34].classList.add('wallTMP');
            murAPose[2] = cellIndex + 34;
            if (col > 0 && !downCell.classList.value.match(/\bwall[AB]\b/) && (downCell.classList.contains('odd-row') || downCell.classList.contains('odd-col'))) {
                downCell.classList.add('wallTMP');
                downCell.classList.add('rotation');
            }
            murAPose[0] = cellIndex + 17;
            poser = true;
        }
    }
    mettreAJourTableau(cellsGrid, cells);
    if (poser) {
        if (activePlayer === 'playerA') {
            nbWallPlayerA--;
            document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
        } else if (activePlayer === 'playerB') {
            nbWallPlayerB--;
            document.getElementById('nbWallPlayerB').textContent = `Murs restants : ${nbWallPlayerB}`;
        }

        if (wallPlacable() === 0) {
            showValider();
        } else {

            alert("Vous ne pouvez pas poser ce mur au risque de bloquer un joueur");
            annulerWall();
        }

    }
}

function rotationWall(cellIndex) {
    const rightCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];
    const upCell = cells[cellIndex + 17];
    const downCell = cells[cellIndex - 17];
    if ((rightCell.classList.contains('wallTMP') || leftCell.classList.contains('wallTMP')) && !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/)) {
        murAPose[0] = cellIndex;
        murAPose[1] = cellIndex - 17;
        murAPose[2] = cellIndex + 17;
        rightCell.classList.remove('wallTMP');
        leftCell.classList.remove('wallTMP');
        upCell.classList.add('wallTMP');
        downCell.classList.add('wallTMP');
    } else if ((upCell.classList.contains('wallTMP') || downCell.classList.contains('wallTMP')) && !rightCell.classList.value.match(/\bwall[AB]\b/) && !leftCell.classList.value.match(/\bwall[AB]\b/)) {

        murAPose[0] = cellIndex;
        murAPose[1] = cellIndex + 1;
        murAPose[2] = cellIndex - 1;
        upCell.classList.remove('wallTMP');
        downCell.classList.remove('wallTMP');
        rightCell.classList.add('wallTMP');
        leftCell.classList.add('wallTMP');
    }
    mettreAJourTableau(cellsGrid, cells);
}

function removeWallTmp() {
    var bougerMur = false;
    for (let i in murAPose) {
        const tmpcell = cells[murAPose[i]];
        if (tmpcell.classList.contains('wallTMP')) {
            tmpcell.classList.remove('wallTMP');
            tmpcell.classList.remove('rotation');
            bougerMur = true;
        }
    }
    mettreAJourTableau(cellsGrid, cells);
    return bougerMur;
}

function showAntiCheat() {
    document.querySelector('.anti-cheat').style.display = 'grid';
    wrapper.style.display = 'none';
}

function wallPlacable() {
    dijkstraVisitedNode = [];
    var tab = {};
    for (var i = 0; i < cells.length; i = i + 2) {
        if (!cells[i].classList.contains('odd-row') && !cells[i].classList.contains('odd-col')) {

            var tmp = [];
            if (cells[i - 1] != undefined && (!cells[i - 1].classList.value.match(/\bwall[AB]\b/) && !cells[i - 1].classList.contains('wallTMP'))) {//il n'y a pas de mur a gauche

                tmp.push((i + 1) - 2);
            }
            if (cells[i + 1] != undefined && (!cells[i + 1].classList.value.match(/\bwall[AB]\b/) && !cells[i + 1].classList.contains('wallTMP'))) {//il n'y a pas de mur a droite
                tmp.push((i + 1) + 2);
            }
            if (cells[i - 17] != undefined && (!cells[i - 17].classList.value.match(/\bwall[AB]\b/) && !cells[i - 17].classList.contains('wallTMP'))) {//il n'y a pas de mur au dessus
                tmp.push((i + 1) - 34);
            }
            if (cells[i + 17] != undefined && (!cells[i + 17].classList.value.match(/\bwall[AB]\b/) && !cells[i + 17].classList.contains('wallTMP'))) {//il n'y a pas de mur en dessous
                tmp.push(i + 1 + 34);
            }
            tab["" + (i + 1)] = tmp;
        }
    }

    var res1 = dijkstra("playerA", player1Position + 1, tab);

    dijkstraVisitedNode = [];
    var res2 = dijkstra("playerB", player2Position + 1, tab)

    var res = Math.max(res1, res2);
    mettreAJourTableau(cellsGrid, cells);
    return res;
}

function dijkstra(player, cellule, tab) {
    var lanePlayerAArray = Array.from(lanePlayerA);
    var lanePlayerBArray = Array.from(lanePlayerB);
    if (player === 'playerA') {

        if (lanePlayerBArray.includes(document.getElementById('' + cellule))) {

            return 0;
        }
    }
    if (player === 'playerB') {

        if (lanePlayerAArray.includes(document.getElementById('' + cellule))) {

            return 0;
        }
    }
    if (dijkstraVisitedNode.includes(cellule)) {

        return 999;
    } else {
        var tmpTab = [];
        dijkstraVisitedNode.push(cellule);
        for (var voisin in tab['' + cellule]) {
            tmpTab.push(dijkstra(player, tab["" + cellule][voisin], tab));
        }
        return Math.min.apply(null, tmpTab);
    }
}

function checkNoMove() {
    if (activePlayer === 'playerA') {
        const validMoves = getValidMoves(player1Position);
        if (validMoves.length == 0 && nbWallPlayerA === 0) {
            alert("passage de tour");
            newMove.player = "playerA";
            newMove.type = "idle";
            newMove.position = player1Position;
            changeActivePlayer();
        }
    } else if (activePlayer === 'playerB') {
        const validMoves = getValidMoves(player2Position);

        if (validMoves.length == 0 && (nbWallPlayerB === 0 || getCookie("typeDePartie") == "bot")) {
            alert("passage de tour");
            newMove.player = "playerB";
            newMove.type = "idle";
            newMove.position = player2Position;
            changeActivePlayer();
        }
    }
}

function getValidMoves(position) {

    const row = Math.floor(position / 17);
    const col = position % 17;
    const moves = [];


    const cellFoward = cells[position + 17];
    const cellBackward = cells[position - 17];
    const cellLeft = cells[position - 1];
    const cellRight = cells[position + 1];

    const cellFowardPlus1 = cells[position + 34];
    const cellBackwardPlus1 = cells[position - 34];
    const cellLeftPlus1 = cells[position - 2];
    const cellRightPlus1 = cells[position + 2];

    if (row > 0 && !(cellBackward.classList.value.match(/\bwall[AB]\b/))) {
        if (cellBackwardPlus1.classList.value.match(/\bplayer[AB]\b/) || cellBackwardPlus1.classList.value.match(/\bplayer[AB]Fog\b/)) {
            if (!(cells[position - 51].classList.value.match(/\bwall[AB]\b/)))
                moves.push(position - 68);
        } else
            moves.push(position - 34);
    }
    if (row < 16 && !(cellFoward.classList.value.match(/\bwall[AB]\b/))) {
        if (cellFowardPlus1.classList.value.match(/\bplayer[AB]\b/) || cellFowardPlus1.classList.value.match(/\bplayer[AB]Fog\b/)) {
            if (!(cells[position + 51].classList.value.match(/\bwall[AB]\b/)))
                moves.push(position + 68);
        } else
            moves.push(position + 34);
    }
    if (col > 0 && !(cellLeft.classList.value.match(/\bwall[AB]\b/))) {
        if (cellLeftPlus1.classList.value.match(/\bplayer[AB]\b/) || cellLeftPlus1.classList.value.match(/\bplayer[AB]Fog\b/)) {
            if (!(cells[position - 3].classList.value.match(/\bwall[AB]\b/)))
                moves.push(position - 4);
        } else
            moves.push(position - 2);
    }
    if (col < 16 && !(cellRight.classList.value.match(/\bwall[AB]\b/))) {
        if (cellRightPlus1.classList.value.match(/\bplayer[AB]\b/) || cellRightPlus1.classList.value.match(/\bplayer[AB]Fog\b/)) {
            if (!(cells[position + 3].classList.value.match(/\bwall[AB]\b/)))
                moves.push(position + 4);
        } else
            moves.push(position + 2);
    }
    return moves;

}

function changeActivePlayer() {
    if (activePlayer == "playerB" && getCookie("typeDePartie") === "bot_v2") {

        activePlayer = activePlayer === 'playerA' ? 'playerB' : 'playerA';
        activateFog(cells);
        activePlayer = activePlayer === 'playerA' ? 'playerB' : 'playerA';
        activateFog(cells);

        //TODO JE SAIS PAS OU ELLE EST
        convertBoard();
        updateBoard(gameState1);
    }

    activePlayer = activePlayer === 'playerA' ? 'playerB' : 'playerA';
    document.getElementById('currentPlayer').textContent = `Tour : ${activePlayer}`;
    if (tour <= 200)
        document.getElementById('nbTour').textContent = `Tour : n°${200 -(tour - 1)}`;
    if(!getCookie("typeDePartie").includes("bot"))
        showAntiCheat();

    tour--;

    activateFog(cells);
    checkCrossing(player1Position, player2Position);
    if (activePlayer === "playerA") {
        showForfaitA();
        hideForfaitB();
    } else {
        showForfaitB();
        hideForfaitA();
    }

    murAPose = new Array(3);
    checkTour201();
    if (activePlayer === "playerB" && getCookie("typeDePartie") === "bot") {

        if (tour > 200) {
            return movePlyerFirstTurn(player2Position);
        } else {
            var possiblesMoves = getValidMoves(player2Position);
           var returnValue = computeMove(possiblesMoves);
                movePlayer(player2Position);
                movePlayer(returnValue);
        }
    } else if (activePlayer === "playerB" && getCookie("typeDePartie") === "bot_v2") {

        if (tour > 200) {

            //TODO PAREIL POUR CELLE LA
            var resPromise = setup(2);
            resPromise.then(cellIndex => {
                var newCellIndex = convertGameStateToPosition((cellIndex).toString());
                movePlyerFirstTurn(newCellIndex);
            });
        } else {

            convertBoard();
            if (activePlayer === "playerB") {
                gameState1 = new gameState(playerBWalls, playerAWalls, board);
            } else {
                gameState1 = new gameState(playerAWalls, playerBWalls, board);
            }

            var time = Date.now();

            var nMovePromise = nextMove(gameState1); // Stocker la promesse retournée par nextMove


            nMovePromise.then(nMove => {

                if (nMove.action === "move") {
                    var pos = nMove.value;
                    var newPos = convertGameStateToPosition(pos.toString());
                    movePlayer(player2Position);
                    movePlayer(newPos);

                } else if (nMove.action === "wall") {
                    var pos = nMove.value;
                    var wall = pos[0];
                    var orientation = pos[1];
                    var cellIndex = convertGameStateToPosition(wall.toString()) + 18;
                    handleWall(cellIndex);
                    if (orientation === 1) {
                        rotationWall(cellIndex);
                    }
                    validerWall();
                }
            }).catch(error => {
                console.error("Erreur lors de l'exécution de nextMove:", error);
            });

            var time2 = (Date.now() - time);
            if (time2 >= 190) {
                console.log("ALLLLEEEERRRTTTTEEEE : " + time2);
            }
        }

    }


    saveToBack();
}

function convertBoard() {
    var opponent;
    if (activePlayer === "playerA") {
        opponent = "playerB";
    } else {
        opponent = "playerA";
    }
    let j = 0;
    let k = 0;

    for (let m = 272; m < 289; m = m - 34) {

        if (!(cells[m].classList.contains('odd-row') || cells[m].classList.contains('odd-col'))) {
            if (k > 8) {
                j = j + 1;
                k = 0;
            }

            if (cells[m].classList.contains(activePlayer)) {
                board[j][k] = 1;
            } else if (cells[m].classList.contains(opponent)) {
                board[j][k] = 2;
            } else if (cells[m].classList.contains('fog')) {
                board[j][k] = -1;
            } else {
                board[j][k] = 0;
            }


            k = k + 1;
        }
        if (m < 17) {
            m = m + 274 + 34;
        }
    }
}

function movePlyerFirstTurn(cellIndex) {
    cells = cellsGrid;
    //deplacer le joueur sur la cellule cliqué si elle est sur la ligne du haut et si c'est au tour du joueur A
    //deplacer le joueur sur la cellule cliqué si elle est sur la ligne du bas et si c'est au tour du joueur B

    if (activePlayer === 'playerA' && cellIndex >= 272 && cellIndex <= 288 && cells[cellIndex].classList.contains('first-turn')) {
        cells[player1Position].classList.remove('playerA');
        player1Position = cellIndex;
        cells[player1Position].classList.add('playerA');
        const topRows = document.querySelectorAll('.bot-row');
        topRows.forEach(row => row.classList.remove('first-turn'));
        const message = document.querySelector('.message');
        message.parentNode.removeChild(message);
        changeVisibilityPlayer(false, player1Position, "playerA");
        firstTurn = false;
        newMove.player = 'playerA';
        newMove.type = 'move';
        newMove.position = player1Position;

        mettreAJourTableau(cellsGrid, cells);
        changeActivePlayer();
    } else if (activePlayer === 'playerB' && cellIndex >= 0 && cellIndex <= 16 && cells[cellIndex].classList.contains('first-turn')) {

        cells[player2Position].classList.remove('playerB');
        player2Position = cellIndex;
        cells[player2Position].classList.add('playerB');
        const BottomRows = document.querySelectorAll('.top-row');
        BottomRows.forEach(row => row.classList.remove('first-turn'));
        const message = document.querySelector('.message');
        message.parentNode.removeChild(message);
        changeVisibilityPlayer(false, player2Position, "playerB");
        firstTurn = false;
        newMove.player = 'playerB';
        newMove.type = 'move';
        newMove.position = player2Position;

        mettreAJourTableau(cellsGrid, cells);
        saveToBack();
        changeActivePlayer();
    }
}

function changeVisibilityPlayer(remove, position, player) {

    cellPlayer = cells[position];
    cellLeft = cells[position - 2];
    cellRight = cells[position + 2];
    cellTop = cells[position - 34];
    cellBot = cells[position + 34];
    if (remove === true) {
        if (player === 'playerB') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) + 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/)) && cellLeft.hasAttribute('visibility')) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) + 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/)) && cellRight.hasAttribute('visibility')) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) + 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/)) && cellTop.hasAttribute('visibility')) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) + 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/)) && cellBot.hasAttribute('visibility')) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) + 1);
            }
        } else if (player === 'playerA') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) - 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/)) && cellLeft.hasAttribute('visibility')) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) - 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/)) && cellRight.hasAttribute('visibility')) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) - 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/)) && cellTop.hasAttribute('visibility')) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) - 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/)) && cellBot.hasAttribute('visibility')) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) - 1);
            }
        }

    } else if (remove === false) {
        if (player === 'playerB') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) - 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/)) && cellLeft.hasAttribute('visibility')) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) - 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/)) && cellRight.hasAttribute('visibility')) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) - 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/)) && cellTop.hasAttribute('visibility')) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) - 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/)) && cellBot.hasAttribute('visibility')) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) - 1);
            }
        } else if (player === 'playerA') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) + 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/)) && cellLeft.hasAttribute('visibility')) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) + 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/)) && cellRight.hasAttribute('visibility')) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) + 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/)) && cellTop.hasAttribute('visibility')) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) + 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/)) && cellBot.hasAttribute('visibility')) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) + 1);
            }
        }
    }
    mettreAJourTableau(cellsGrid, cells);
}

function movePlayer(cellIndex) {

    if (firstTurn) {

        return;
    }
    if (murAPose[0] != undefined) {

        annulerWall();
    }

    const clickedCell = cells[cellIndex];

    if (cellIndex === player1Position && activePlayer === 'playerA') {

        handleCellClick(cellIndex, player1Position);
    }
    if (cellIndex === player2Position && activePlayer === 'playerB') {
        handleCellClick(cellIndex, player2Position);
    }

    // Vérifier si la cellule cliquée a la classe 'possible-move'
    if (clickedCell.classList.contains('possible-move')) {

        // Retirer le joueur actif de sa position actuelle
        const currentPlayerPosition = activePlayer === 'playerA' ? player1Position : player2Position;
        cells[currentPlayerPosition].classList.remove(activePlayer);

        changeVisibilityPlayer(true, currentPlayerPosition, activePlayer);

        // Mettre à jour la position du joueur actif
        if (activePlayer === 'playerA') {
            player1Position = cellIndex;
            newMove.player = 'playerA';
            newMove.type = 'move';
            newMove.position = player1Position;

        } else {
            player2Position = cellIndex;
            newMove.player = 'playerB';
            newMove.type = 'move';
            newMove.position = player2Position;

        }

        // Ajouter le joueur actif à sa nouvelle position
        clickedCell.classList.add(activePlayer);

        // Réinitialiser les classes 'possible-move'
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;

        // Basculer vers l'autre joueur

        changeVisibilityPlayer(false, activePlayer === 'playerA' ? player1Position : player2Position, activePlayer);
        mettreAJourTableau(cellsGrid, cells);
        changeActivePlayer();
    }
}

function showValider() {
    var id = "#valider";
    if (activePlayer === 'playerA')
        id += "A";
    else
        id += "B";
    document.querySelector(id).style.display = 'grid';
}

function annulerWall() {
    const clickedCell = cells[murAPose[0]];
    const rigthCell = cells[murAPose[1]];
    const leftCell = cells[murAPose[2]];

    clickedCell.classList.remove('wallTMP');
    clickedCell.classList.remove('rotation');
    rigthCell.classList.remove('wallTMP');
    leftCell.classList.remove('wallTMP');
    if (activePlayer === 'playerA') {
        nbWallPlayerA++;
        document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
    } else {
        nbWallPlayerB++;
        document.getElementById('nbWallPlayerB').textContent = `Murs restants : ${nbWallPlayerB}`;
    }

    mettreAJourTableau(cellsGrid, cells);
    hideValider();
}

function handleCellClick(cellIndex, position) {
    const validMoves = getValidMoves(position);
    if (isClickedCell) {
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    } else {

        validMoves.forEach(move => {
            const moveCell = cells[move];

            if (!moveCell.classList.contains('playerA') && !moveCell.classList.contains('playerB')) {
                moveCell.classList.add('possible-move');
                isClickedCell = true;
                mettreAJourTableau(cellsGrid, cells);
            }
        });
    }
}

function saveToBack() {
    cellsTmp = getClassesAndAttributesFromDivs(cellsGrid);
    socket.emit('saveToBack', activePlayer, nbWallPlayerA, nbWallPlayerB, player1Position, player2Position, tour, cellsTmp, playerAWalls, playerBWalls, firstTurn, dernierTourB);
}


