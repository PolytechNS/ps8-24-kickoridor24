var currentWall;
var nbWalls = 10;
var nbWallsOpponent = 10;
var deplacement = 0;
var positionBot = 0;
var walls;
var IAplay;
var dijkstraVisitedNode = [];
var positionOpponent = null;
var opponentNextMove = [];
var ouverture = 1;
var oneWay = false;
var opponentWallPlaced = false;
class Move {
    constructor(action, value) {
        this.action = action;
        this.value = value;
    }
}


function setup(AIplay) {
    //console.log("le bot est le joueur numero " + AIplay);
    IAplay = AIplay;
    deplacement = 0;
    var positionBot = '00';
    if (AIplay === 1) {
        positionBot = '51';
    } else if (AIplay === 2) {
        positionBot = '59';
    }

    return new Promise((resolve, reject) => {
        resolve(positionBot);
    });
}

function nextMove(gameState) {
    //init des variables


    var opponentfound = false;
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board[i].length; j++) {
            if (gameState.board[i][j] === 1) {
                positionBot = i;
                positionBot += "" + j;
            }
            if (gameState.board[i][j] === 2) {
                positionOpponent = i;
                positionOpponent += "" + j;
                opponentfound = true;
            }
        }
    }
    nbWalls = 10 - gameState.ownWalls.length;

    var nbwallOpponentTMP = 10 - gameState.opponentWalls.length;
    if(nbWallsOpponent > nbwallOpponentTMP){
        opponentWallPlaced = true;

    }
    nbWallsOpponent = nbwallOpponentTMP;
    if (!opponentfound ) {
        if(opponentWallPlaced){//il a pas bougé, surement caché derriere un mur

        }
        else if(positionOpponent = null)
            positionOpponent = null;
        else{
            //on connaissait sa position + il a bougé

            determineOpponentPosition(gameState);

        }

    }
    //console.log("position opponent : " + positionOpponent);
    walls = gameState.opponentWalls.concat(gameState.ownWalls);

    if (ouverture <= 5) {
        //bloquer tunnel
        if (deplacement <= 4) {
            var isTunnel = findTunnel(gameState);
            if (isTunnel !== '00') {
                if (putWall(gameState, isTunnel, 0) !== false) {
                    deplacement++;
                    //console.log(putWall(gameState, isTunnel, 0));
                    return new Promise((resolve, reject) => {
                        resolve(putWall(gameState, isTunnel, 0));
                    });
                } else {
                    //console.log("HASSOUL TUNNEL DEJA BLOQUE");
                }
            }
        }
        var resultat = ouvertureProcess(gameState);
        //console.log(resultat);

        return new Promise((resolve, reject) => {
            resolve(resultat);
        });
    }
    //bouger
    var tab = hashMapVoisin(gameState.board, walls);


    var cheminLePlusCoutBot = pathFinding(positionBot, gameState.board, "bot");

    if (cheminLePlusCoutBot === "idle" && nbWalls === 0) {

        return new Promise((resolve, reject) => {
            resolve(new Move('idle'));
        });
    } else if (cheminLePlusCoutBot === "idle") {
        //obliger de poser un mur
        var opponentPath = pathFinding(positionOpponent, gameState.board, "opponent");
        var  botPath = pathFinding(positionBot, gameState.board, "bot");
        var wallIntelligent = verifPutWall(gameState, (parseInt(positionOpponent)+11).toString(), opponentPath.length, botPath.length);
        if ( wallIntelligent !== false) {
            return new Promise((resolve, reject) => {
                resolve(new Move('wall',wallIntelligent));
            });
        }
        return new Promise((resolve, reject) => {
            resolve(new Move('idle'));
        });
    } else {
        //  PassOrBlock(gameState, gameState.board, walls);
        //console.log();
        //console.log((parseInt(cheminLePlusCoutBot[0]) + 11));

        return new Promise((resolve, reject) => {
            //resolve(true);
            resolve(PassOrBlock(gameState, gameState.board, walls));
        });
    }

}

function correction(rightMove) {
    ouverture = 99;
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}

function updateBoard(gameState) {
    opponentNextMove = [];
    walls = gameState.opponentWalls.concat(gameState.ownWalls);
    var found = false;
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board[i].length; j++) {
            if (gameState.board[i][j] === 2) {
                positionOpponent = i;
                positionOpponent += "" + j;
                found = true;
            }
        }
    }
    if(found) {
        var chemins = allchemin(positionOpponent, gameState.board, "opponent", walls);
        var chemins = allchemin(positionOpponent, gameState.board, "opponent", walls);

        opponentNextMove = [];
        for(var i =0;i<chemins.length;i++){
            opponentNextMove.push(chemins[i][0]);
        }
        //console.log(opponentNextMove);
    }
    else if(!found && opponentWallPlaced && positionOpponent != null){
        var chemins = allchemin(positionOpponent, gameState.board, "opponent", walls);

        opponentNextMove = [];
        for(var i =0;i<chemins.length;i++){
            opponentNextMove.push(chemins[i][0]);
        }
    }
    opponentWallPlaced = false;


    return new Promise((resolve, reject) => {
        resolve(true);
    });
}


var dijkstraVisitedNode = [];

function pathFinding(posJoueur, board, player) {

    var ligneFinale = new Array();
    if (IAplay === 1) {
        ligneFinale = board[8];
    } else {
        ligneFinale = board[0];

    }
    let x = [...board];
    //  let result =  x.concat(board.reverse().slice(1,board.length));
    //console.table(board);

    if (player == "bot") {

        var possiblesMoves = validMoves(positionBot[0], positionBot[1],board,walls);

    } else {
        var possiblesMoves = validMoves(positionOpponent[0], positionOpponent[1],board,walls);
    }


    var tab = hashMapVoisin(board, walls);
    var tabRes = [];
    for (var i = 0; i < possiblesMoves.length; i++) {
        dijkstraVisitedNode = [];
        if (player === "bot") {
            tabRes.push(dijkstraNode(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab));
        } else {
            tabRes.push(dijkstraNode(IAplay == 1 ? "playerB" : "playerA", possiblesMoves[i], tab));
        }

    }

    if (tabRes.length === 1) {
        if (player === "bot") {

            if (!checkBonDeplacement(tabRes[0], tab)) {

                return "idle"; //mouvement pas bon
            }
        }
    }
    var indice = 999;
    var longueur = 999;
    for (var i = 0; i < tabRes.length; i++) {
        if (tabRes[i].length < longueur) {
            longueur = tabRes[i].length;
            indice = i;
        }
    }
    if (indice === 999) {
        return "idle"; //impossible de bouger
    }
    return tabRes[indice];
}


function findTunnel(gameState) {
    var walls = gameState.ownWalls.concat(gameState.opponentWalls);
    if (walls.length >= 2) {
        if (IAplay === 1) {
            const sortedPlayerBWalls = sortTabBiggerFirst(walls);
            for (let i = 0; i < sortedPlayerBWalls.length; i++) {
                if (sortedPlayerBWalls[i + 1] !== undefined) {
                    if ((sortedPlayerBWalls[i][0] === '89' && sortedPlayerBWalls[i + 1][0] === '87') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        if (sortedPlayerBWalls[i + 2] !== undefined && (sortedPlayerBWalls[i + 2][0] === '85' && sortedPlayerBWalls[i + 2][1] === 1)) return '83';
                        return '85';
                    } else if ((sortedPlayerBWalls[i][0] === '79' && sortedPlayerBWalls[i + 1][0] === '77') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        if (sortedPlayerBWalls[i + 2] !== undefined && (sortedPlayerBWalls[i + 2][0] === '75' && sortedPlayerBWalls[i + 2][1] === 1)) return '83';
                        return '85';
                    } else if ((sortedPlayerBWalls[i][0] === '29' && sortedPlayerBWalls[i + 1][0] === '27') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        if (sortedPlayerBWalls[i + 2] !== undefined && (sortedPlayerBWalls[i + 2][0] === '25' && sortedPlayerBWalls[i + 2][1] === 1)) return '13';
                        return '15';
                    } else if ((sortedPlayerBWalls[i][0] === '19' && sortedPlayerBWalls[i + 1][0] === '17') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        if (sortedPlayerBWalls[i + 2] !== undefined && (sortedPlayerBWalls[i + 2][0] === '15' && sortedPlayerBWalls[i + 2][1] === 1)) return '13';
                        return '15';
                    }
                }
            }
        } else if (IAplay === 2) {
            const sortedPlayerAWalls = sortTabLowerFirst(walls);
            for (let j = 0; j < sortedPlayerAWalls.length; j++) {
                if (sortedPlayerAWalls[j + 1] !== undefined) {

                    if ((sortedPlayerAWalls[j][0] === '12' && sortedPlayerAWalls[j + 1][0] === '14') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {

                        if (sortedPlayerAWalls[j + 2] !== undefined && (sortedPlayerAWalls[j + 2][0] === '16' && sortedPlayerAWalls[j + 2][1] === 1)) return '18';
                        return '16';
                    } else if ((sortedPlayerAWalls[j][0] === '22' && sortedPlayerAWalls[j + 1][0] === '24') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
                        if (sortedPlayerAWalls[j + 2] !== undefined && (sortedPlayerAWalls[j + 2][0] === '26' && sortedPlayerAWalls[j + 2][1] === 1)) return '18';
                        return '16';
                    } else if ((sortedPlayerAWalls[j][0] === '72' && sortedPlayerAWalls[j + 1][0] === '74') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
                        if (sortedPlayerAWalls[j + 2] !== undefined && (sortedPlayerAWalls[j + 2][0] === '76' && sortedPlayerAWalls[j + 2][1] === 1)) return '88';
                        return '86';
                    } else if ((sortedPlayerAWalls[j][0] === '82' && sortedPlayerAWalls[j + 1][0] === '84') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
                        if (sortedPlayerAWalls[j + 2] !== undefined && (sortedPlayerAWalls[j + 2][0] === '86' && sortedPlayerAWalls[j + 2][1] === 1)) return '88';
                        return '86';
                    }
                }
            }
        }
    }
    return '00';
}

function sortTabBiggerFirst(tab) {
    return tab.sort(function (a, b) {
        return b[0] - a[0];
    });
}

function sortTabLowerFirst(tab) {
    return tab.sort(function (a, b) {
        return a[0] - b[0];
    });
}

function putWall(gameState, pos, orientation) {
    if(pos>90 || pos<10){
        return false;
    }
    if(pos[1] <= 1){return false;}
    if (nbWalls > 0) {

        let posInInt = parseInt(pos);
        var walls = gameState.opponentWalls.concat(gameState.ownWalls);
        if (walls.length >= 1) {
            for (let i = 0; i < walls.length; i++) {
                if (walls[i][0] === pos) {
                    return false;
                }
                if (orientation === 0 && ((walls[i][0] === (posInInt + 10).toString() && walls[i][1] === 0) || (walls[i][0] === (posInInt - 10).toString() && walls[i][1] === 0))) {
                    return false;
                }
                if (orientation === 1 && ((walls[i][0] === (posInInt + 1).toString() && walls[i][1] === 1) || (walls[i][0] === (posInInt - 1).toString() && walls[i][1] === 1))) {
                    return false;
                }
            }

        }

        walls.push(new Array(pos, orientation));
        dijkstraVisitedNode = [];


        var tab = hashMapVoisin(gameState.board, walls);
        var res1 = 0;
        if (positionOpponent !== null)
            res1 = dijkstra1(IAplay == 2 ? "playerA" : "playerB", positionOpponent, tab);
        else {
            res1 = 0;
        }
        dijkstraVisitedNode = [];
        var res2 = dijkstra1(IAplay == 1 ? "playerA" : "playerB", positionBot, tab);

        var res = Math.max(res1, res2);

        if (res !== 0) {
            //console.log("je peux pas placer la sinon je bloque un joueur");
            return false;
        } else {

            return new Move('wall', [pos, orientation]);
        }


    }
    return false;
}

function dijkstra1(player, cellule, tab) {

    const lanePlayerAArray = ['00', '10', '20', '30', '40', '50', '60', '70', '80'];
    const lanePlayerBArray = ['08', '18', '28', '38', '48', '58', '68', '78', '88'];

    if (player === 'playerA') {
        if (lanePlayerBArray.includes(cellule)) {

            return 0;
        }
    }
    if (player === 'playerB') {
        if (lanePlayerAArray.includes(cellule)) {

            return 0;
        }
    }

    if (dijkstraVisitedNode.includes(cellule)) {

        return 999;
    } else {
        var tmpTab = [];
        dijkstraVisitedNode.push(cellule);

        for (var voisin in tab["" + cellule]) {

            tmpTab.push(dijkstra1(player, tab["" + cellule][voisin], tab));
        }
        return Math.min.apply(null, tmpTab);
    }
}


function validMoves(positionI, positionJ,board,walls) {

    var mouvement = [];
    const cellRight = (parseInt(positionI) + 1) + "" + positionJ;
    const cellLeft = (parseInt(positionI) - 1) + "" + positionJ;
    const cellBackward = positionI + "" + (positionJ - 1);
    const cellFoward = positionI + "" + (parseInt(positionJ) + 1);

    const cellLeftPlus1 = (positionI - 2) + "" + positionJ;
    const cellRightPlus1 = (parseInt(positionI) + 2) + "" + positionJ;
    const cellBackwardPlus1 = positionI + "" + (positionJ - 2);
    const cellFowardPlus1 = positionI + "" + (parseInt(positionJ) + 2);


    if (positionJ < 8)//impossible de monter sinon
    {
        if (board[cellFoward[0]][cellFoward[1]] === 2) {
            if (deplacementPossible(positionI, positionJ, cellFowardPlus1[0], cellFowardPlus1[1], walls))
                mouvement.push(cellFowardPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellFoward[0], cellFoward[1], walls))
                mouvement.push(cellFoward);
        }
    }

    if (positionJ > 0)//impossible de descendre sinon
    {
        if (board[cellBackward[0]][cellBackward[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellBackwardPlus1[0], cellBackwardPlus1[1], walls))
                mouvement.push(cellBackwardPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellBackward[0], cellBackward[1], walls)){
                mouvement.push(cellBackward);
                //console.log("oookkkkk POUR DESCENDRE");
            }

        }
    }
    if (positionI > 0)//impossible d'aller a gauche sinon
    {
        if (board[cellLeft[0]][cellLeft[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellLeftPlus1[0], cellLeftPlus1[1], walls))
                mouvement.push(cellLeftPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellLeft[0], cellLeft[1], walls)){
                mouvement.push(cellLeft);
                //console.log("oookkkkk POUR ALLER A GAUCHE");
            }

        }
    }
    if (positionI < 8)//impossible d'aller a droite sinon
    {

        if (board[cellRight[0]][cellRight[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellRightPlus1[0], cellRightPlus1[1], walls))
                mouvement.push(cellRightPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellRight[0], cellRight[1], walls))
                mouvement.push(cellRight);
        }
    }

    return mouvement;
}

function deplacementPossible(positionI, positionJ, mouvementI, mouvementJ, walls) {
    if (positionI < 0 || positionJ < 0 || mouvementJ < 0 || mouvementI < 0 ||
        positionI > 8 || positionJ > 8 || mouvementJ > 8 || mouvementI > 8)
        return false;
//vérifier que ya pas de mur entre les deux pos
    var deplacementI = positionI - mouvementI;
    var deplacementJ = positionJ - mouvementJ;
    mouvementI++;
    mouvementJ++;//pour les mettres au memes coordonées que les murs
    if (deplacementI == -1) {//deplacement vers la droite
        var murVerticalHaut = "" + (parseInt(positionI) + 1) + (parseInt(positionJ) + 2);
        var murVerticalBas = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 1);
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murVerticalBas && walls[x][1] == 1) ||
                (walls[x][0] == murVerticalHaut && walls[x][1] == 1)) {
                return false;
            }
        }
        return true;
    } else if (deplacementI == -2) {//deplacement vers la droite avec un saut
        var murVerticalHaut = "" + (parseInt(positionI) + 1) + (parseInt(positionJ) + 2);
        var murVerticalBas = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 1);
        var murVerticalHaut2 = "" + (parseInt(positionI) + 2) + (parseInt(positionJ) + 2);
        var murVerticalBas2 = "" + (parseInt(positionI) + 2) + "" + (parseInt(positionJ) + 1);
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murVerticalBas && walls[x][1] == 1) ||
                (walls[x][0] == murVerticalHaut && walls[x][1] == 1)
                ||
                (walls[x][0] == murVerticalHaut2 && walls[x][1] == 1)
                ||
                (walls[x][0] == murVerticalBas2 && walls[x][1] == 1)) {
                return false;
            }
        }
        return true;
    } else if (deplacementI == 1) {//deplacement vers la gauche
        var murVerticalHaut = "" + (parseInt(positionI)) + (parseInt(positionJ) + 2);
        var murVerticalBas = "" + (parseInt(positionI)) + "" + (parseInt(positionJ) + 1);

        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murVerticalBas && walls[x][1] == 1) ||
                (walls[x][0] == murVerticalHaut && walls[x][1] == 1)) {
                return false;
            }
        }
        return true;
    } else if (deplacementI == 2) {//deplacement vers la gauche avec un saut
        var murVerticalHaut = "" + (parseInt(positionI)) + (parseInt(positionJ) + 2);
        var murVerticalBas = "" + (parseInt(positionI)) + "" + (parseInt(positionJ) + 1);
        var murVerticalHaut2 = "" + (parseInt(positionI) - 1) + (parseInt(positionJ) + 2);
        var murVerticalBas2 = "" + (parseInt(positionI) - 1) + "" + (parseInt(positionJ) + 1);
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murVerticalBas && walls[x][1] == 1) ||
                (walls[x][0] == murVerticalHaut && walls[x][1] == 1)
                ||
                (walls[x][0] == murVerticalHaut2 && walls[x][1] == 1)
                ||
                (walls[x][0] == murVerticalBas2 && walls[x][1] == 1)) {
                return false;
            }
        }
        return true;
    } else if (deplacementJ == 1) {//deplacement vers le bas
        var murHorizontaleGauche = "" + (parseInt(positionI)) + (parseInt(positionJ) + 1);
        var murHorizontaleDroit = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 1);
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murHorizontaleGauche && walls[x][1] == 0) ||
                (walls[x][0] == murHorizontaleDroit && walls[x][1] == 0)) {
                return false;
            }
        }
        return true;
    } else if (deplacementJ == 2) {//deplacement vers le bas avec un saut
        var murHorizontaleGauche = "" + (parseInt(positionI)) + (parseInt(positionJ) + 1);
        var murHorizontaleDroit = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 1);
        var murHorizontaleGauche2 = "" + (parseInt(positionI)) + (parseInt(positionJ));
        var murHorizontaleDroit2 = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ));
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murHorizontaleGauche && walls[x][1] == 0) ||
                (walls[x][0] == murHorizontaleDroit && walls[x][1] == 0)
                ||
                (walls[x][0] == murHorizontaleGauche2 && walls[x][1] == 0)
                ||
                (walls[x][0] == murHorizontaleDroit2 && walls[x][1] == 0)) {
                return false;
            }
        }
        return true;
    } else if (deplacementJ == -1) {//deplacement vers le haut
        var murHorizontaleGauche = "" + (parseInt(positionI)) + (parseInt(positionJ) + 2);
        var murHorizontaleDroit = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 2);
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murHorizontaleGauche && walls[x][1] == 0) ||
                (walls[x][0] == murHorizontaleDroit && walls[x][1] == 0)) {
                return false;
            }
        }
        return true;
    } else if (deplacementJ == -2) {//deplacement vers le haut avec un saut
        var murHorizontaleGauche = "" + (parseInt(positionI)) + (parseInt(positionJ) + 2);
        var murHorizontaleDroit = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 2);
        var murHorizontaleGauche2 = "" + (parseInt(positionI)) + (parseInt(positionJ) + 3);
        var murHorizontaleDroit2 = "" + (parseInt(positionI) + 1) + "" + (parseInt(positionJ) + 3);
        for (var x = 0; x < walls.length; x++) {
            if ((walls[x][0] == murHorizontaleGauche && walls[x][1] == 0) ||
                (walls[x][0] == murHorizontaleDroit && walls[x][1] == 0)
                ||
                (walls[x][0] == murHorizontaleGauche2 && walls[x][1] == 0)
                ||
                (walls[x][0] == murHorizontaleDroit2 && walls[x][1] == 0)) {
                return false;
            }
        }
        return true;
    }

    return true;

}

function hashMapVoisin(board, walls) {
    var tab = {};
    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[i].length; j++) {
            var tmp = [];
            if (deplacementPossible(i, j, (parseInt(i) + 1), j, walls)) {
                tmp.push("" + (parseInt(i) + 1) + j);
            }
            if (deplacementPossible(i, j, (parseInt(i) - 1), j, walls)) {
                tmp.push("" + (parseInt(i) - 1) + j);
            }
            if (deplacementPossible(i, j, i, (parseInt(j) + 1), walls)) {
                tmp.push("" + i + (parseInt(j) + 1));
            }
            if (deplacementPossible(i, j, i, (parseInt(j) - 1), walls)) {
                tmp.push("" + i + (parseInt(j) - 1));
            }
            tab["" + i + "" + j] = tmp;
        }
    }

    return tab;

}

function dijkstraNode(player, start, graph) {
    const queue = [[start]];
    const visited = new Set([start]);
    const lanePlayerAArray = ['00', '10', '20', '30', '40', '50', '60', '70', '80'];
    const lanePlayerBArray = ['08', '18', '28', '38', '48', '58', '68', '78', '88'];
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];


        if (player === 'playerA') {
            if (lanePlayerBArray.includes(node)) {

                return path;
            }
        }
        if (player === 'playerB') {
            if (lanePlayerAArray.includes(node)) {

                return path;
            }
        }
        const neighbors = graph[node];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }

    return null; // No path found
}

function checkBonDeplacement(chemin, tab) {
    if(chemin == null){
        return false;
    }
    if (chemin.length > dijkstraNode(IAplay == 1 ? "playerA" : "playerB", positionBot, tab).length) {
        return false;
    }
    return true;
}


function PassOrBlock(gameState, board, walls) {

    let opponentPath = [];
    let botPath = [];
    botPath = pathFinding(positionBot, board, "bot");
    //console.log("botPath : " + botPath);

    if (positionOpponent !== null) {
        //console.log("opponentVisibility : " + positionOpponent);
        opponentPath = pathFinding(positionOpponent, board, "opponent");
        //console.log("opponentPath : " + opponentPath);
        if(opponentPath.length >1 && !oneWay && (nbWalls>=nbWallsOpponent) && botPath.length>1 && nbWallsOpponent >0) {

            var tmp = couloirBot(gameState,walls);

            if(tmp.value != false ){
                oneWay = true;

                return tmp;
            }
        }
        if (opponentPath.length < botPath.length) {
            var res = blockOpponent(gameState, opponentPath, botPath);

            return res;
        } else {
            return new Move('move', (parseInt(botPath[0])+11).toString());
        }
    } else {

        var tmp = false;
        if(!oneWay) {
            tmp = couloirBot(gameState, walls);
        }
        if(tmp == false || tmp.value == false ){
            return new Move('move', (parseInt(botPath[0])+11).toString());
        }
        oneWay = true;
        return tmp;

    }
}

function blockOpponent(gameState, opponentPath, botPath) {

    //ralonger le chemin de l'adversaire pour qu'il soit plus long que celui du bot en ajoutant des murs si possible devant lui
    //console.log("blockOpponent");
    //prochain move vertical ou horizontal
    var posWall;
    var orientation;
    var nextMoveI = opponentPath[0][0] - positionOpponent[0];
    var nextMoveJ = opponentPath[0][1] - positionOpponent[1];
    //console.log("opponenetPath[0][0] : " + opponentPath[0][0]);
    //console.log("positionOpponent[0][0] : " + positionOpponent[0]);
    //console.log("opponenetPath[0][1] : " + opponentPath[0][1]);
    //console.log("positionOpponent[0][1] : " + positionOpponent[1]);
    //console.log("nextMoveI : " + nextMoveI);
    //console.log("nextMoveJ : " + nextMoveJ);
    var posWall2 = null;
    /*
        if (nextMoveI === 1) {
            orientation = 1;
            posWall = (parseInt(positionOpponent[0])) + "" + positionOpponent[1];
            posWall2 = (parseInt(positionOpponent[0])) + "" + (parseInt(positionOpponent[1])+1);
        } else if (nextMoveI === -1) {
            orientation = 1;
            posWall = (parseInt(positionOpponent[0]) - 1) + "" + positionOpponent[1];
            posWall2 = (parseInt(positionOpponent[0]) - 1) + "" + (parseInt(positionOpponent[1])+1);
        } else {
            if (nextMoveJ === -1) {
                orientation = 0;
                posWall = positionOpponent[0] + "" + (parseInt(positionOpponent[1]) );
                posWall2 =(parseInt(positionOpponent[0]) - 1) + "" + (parseInt(positionOpponent[1]) );
            } else if (nextMoveJ === 1) {
                //console.log("positionOpponent[1] : " + positionOpponent[1]);
                //console.log("positionOpponent[0] : " + positionOpponent[0]);

                orientation = 0;
                posWall = positionOpponent[0] + "" + (parseInt(positionOpponent[1]) + 1);
                posWall2 = (parseInt(positionOpponent[0]) - 1) + "" + (parseInt(positionOpponent[1]) + 1);

                //console.log("posWall : " + posWall);
            } else {
                posWall = null;
                //console.log("prochain move pas possible");
            }
        }
        if (posWall !== null) {

            if (putWall(gameState, (parseInt(posWall) + 11).toString(), orientation) !== false) {
                //console.log(putWall(gameState, (parseInt(posWall) + 11).toString(), orientation));

                var wallsTMP = gameState.ownWalls.concat(gameState.opponentWalls);
                wallsTMP.push(new Array((parseInt(posWall) + 11).toString(),orientation));
                var tab = hashMapVoisin(gameState.board,walls);
                var tmpOpponentPath = dijkstraNode(IAplay == 2 ? "playerA" : "playerB",positionOpponent,tab);

                if(tmpOpponentPath.length>opponentPath.length){
                    //console.log("premier choix : " );
                    return putWall(gameState, (parseInt(posWall) + 11).toString(), orientation);
                }

            }
            if (putWall(gameState, (parseInt(posWall2) + 11).toString(), orientation) !== false) {
                //console.log(putWall(gameState, (parseInt(posWall) + 11).toString(), orientation));

                var wallsTMP = gameState.ownWalls.concat(gameState.opponentWalls);
                wallsTMP.push(new Array((parseInt(posWall2) + 11).toString(),orientation));
                var tab = hashMapVoisin(gameState.board,walls);
                var tmpOpponentPath = dijkstraNode(IAplay == 2 ? "playerA" : "playerB",positionOpponent,tab);

                if(tmpOpponentPath.length>opponentPath.length){
                   //.log("second choix : " );
                    return putWall(gameState, (parseInt(posWall2) + 11).toString(), orientation);
                }

            }
        }*/

    var wallIntelligent = verifPutWall(gameState, posWall, opponentPath.length, botPath.length);
    if ( wallIntelligent !== false) {

        return new Move('wall',wallIntelligent);
    }

    return new Move('move', (parseInt(botPath[0])+11).toString());

}

function verifPutWall(gameState, pos, longueurCheminOpponnent, longueurCheminBot) {

    if (nbWalls > 0) {


        const walls = gameState.opponentWalls.concat(gameState.ownWalls);
        var murPossibles = [];
        for (var x = 1; x <= 8; x++) {
            for (var y = 2; y <= 9; y++) {
                for (var orientation = 0; orientation < 2; orientation++) {

                    var newPosI =x;
                    var newPosY = y;

                    if (newPosI <= 0 || newPosI >= 9 || newPosY <=1 || newPosY >= 10) {

                    } else {

                        var newPos = newPosI.toString() + newPosY.toString();
                        let posInInt = parseInt(newPos);
                        var murOk = true;
                        if (walls.length >= 1) {

                            for (let i = 0; i < walls.length; i++) {
                                if (walls[i][0] == posInInt) {
                                    murOk = false;
                                }
                                if (orientation === 0 && ((walls[i][0] === (posInInt + 10).toString() && walls[i][1] === 0) || (walls[i][0] === (posInInt - 10).toString() && walls[i][1] === 0))) {

                                    murOk = false;
                                }
                                if (orientation === 1 && ((walls[i][0] === (posInInt + 1).toString() && walls[i][1] === 1) || (walls[i][0] === (posInInt - 1).toString() && walls[i][1] === 1))) {
                                    murOk = false;
                                }
                            }
                        }
                        if(murOk) {
                            walls.push(new Array(newPos, orientation));

                            dijkstraVisitedNode = [];

                            var tab = hashMapVoisin(gameState.board, walls);
                            var res1 = 0;
                            if (positionOpponent !== null)
                                res1 = dijkstra1(IAplay == 2 ? "playerA" : "playerB", positionOpponent, tab);
                            else {
                                res1 = 0;
                            }
                            dijkstraVisitedNode = [];
                            var res2 = dijkstra1(IAplay == 1 ? "playerA" : "playerB", positionBot, tab);

                            var res = Math.max(res1, res2);

                            if (res === 0 && murOk) {
                                murPossibles.push(new Array(newPos, orientation));
                            }
                            walls.splice(walls.indexOf(new Array(newPos, orientation)), 1);
                        }

                    }
                }
            }

        }

        var tmpLongueurOpponent = 0;
        var tmpLongueurBot = 0;
        var MaxOpponent = 0;
        var diffChemin = longueurCheminOpponnent-longueurCheminBot;
        var indice = 999;
        var diffPos = 99;
        //console.log(murPossibles);
        for (var a = 0; a < murPossibles.length; a++) {

            walls.push(murPossibles[a]);

            tmpLongueurBot = pathFindingTMP(positionBot, gameState.board, "bot", walls).length;


            tmpLongueurOpponent = pathFindingTMP(positionOpponent, gameState.board, "opponent", walls).length;

            if (tmpLongueurOpponent >= MaxOpponent &&( (tmpLongueurOpponent - tmpLongueurBot) >= diffChemin)) {


                var trouve = true;
                var distance = distanceEntrePositions((parseInt(positionOpponent)+11).toString(),murPossibles[a][0],walls,gameState.board);
                //console.log("tmpLongueurOpponent : " + tmpLongueurOpponent);
                //console.log("diffChemin : " + diffChemin);
                //console.log("distance : " + distance);
                if(tmpLongueurOpponent == MaxOpponent){

                    if(distance>=diffPos){
                        trouve = false;
                    }
                }
                if(trouve) {
                    diffPos = distance;
                    MaxOpponent = tmpLongueurOpponent;
                    diffChemin = tmpLongueurOpponent - tmpLongueurBot;
                    indice = a;
                    //console.log("TROUVEEE " + murPossibles[a]);
                }

            }
            walls.splice(walls.indexOf(new Array(newPos, orientation)), 1);

        }
        //console.log("res = " + murPossibles[indice]);
        if(indice===999){
            return false;
        }
        if(longueurCheminOpponnent === MaxOpponent){
            return false;
        }

        return murPossibles[indice];
    }
    return false;
}

function pathFindingTMP(posJoueur, board, player, walls) {


    if (player == "bot") {
        var possiblesMoves = validMoves(positionBot[0], positionBot[1],board,walls);
    } else {
        var possiblesMoves = validMoves(positionOpponent[0], positionOpponent[1],board,walls);
    }

    var tab = hashMapVoisin(board, walls);
    var tabRes = [];

    for (var i = 0; i < possiblesMoves.length; i++) {
        dijkstraVisitedNode = [];
        if (player === "bot") {
            tabRes.push(dijkstraNode(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab));
        } else {
            tabRes.push(dijkstraNode(IAplay == 1 ? "playerB" : "playerA", possiblesMoves[i], tab));
        }

    }
    if (tabRes.length === 1 ) {
        if (player === "bot") {
            if (!checkBonDeplacement(tabRes[0], tab)) {

                return "idle"; //mouvement pas bon
            }
        }
    }
    var indice = 999;
    var longueur = 999;

    for (var i = 0; i < tabRes.length; i++) {
        if (tabRes[i] != null && tabRes[i].length < longueur) {
            longueur = tabRes[i].length;
            indice = i;
        }
    }
    if (indice === 999) {
        return "idle"; //impossible de bouger
    }
    return tabRes[indice];
}

function ouvertureProcess(gameState) {
    walls = gameState.opponentWalls.concat(gameState.ownWalls);
    var posI = parseInt(positionBot[0]) ;
    var posJ = parseInt(positionBot[1]) ;
    var posBotFixed = (parseInt(posI)+1) + "" + (parseInt(posJ)+1);
    //console.log("pos : " +posI +""+ posJ+ "  mouvement : "+ posI+""+ parseInt(posJ - 1));
    if(IAplay === 2){
        if (ouverture === 1) {
            if (deplacementPossible(posI, posJ, posI, parseInt(posJ - 1), walls)) {

                ouverture++;
                return new Move('move', (parseInt(posBotFixed) - 1).toString());
            }
        } else if (ouverture === 2) {
            if (deplacementPossible(posI, posJ, posI, parseInt(posJ - 1), walls)) {

                ouverture++;
                return new Move('move', (parseInt(posBotFixed) - 1).toString());
            }
        } else if (ouverture === 3) {
            if (putWall(gameState, (parseInt(posBotFixed)).toString(), 1) !== false) {

                ouverture++;
                return putWall(gameState, (parseInt(posBotFixed)).toString(), 1);
            }
        }else if (ouverture === 4) {
            if (putWall(gameState, (parseInt(posBotFixed) + 2).toString(), 1) !== false) {
                ouverture++;
                return putWall(gameState, (parseInt(posBotFixed) + 2).toString(), 1);
            }
        }
    }
    else if (IAplay === 1) {
        if (ouverture === 1) {
            if (deplacementPossible(posI, posJ, posI, parseInt(posJ + 1), walls)) {
                ouverture++;
                return new Move('move', (parseInt(posBotFixed) + 1).toString());
            }
        } else if (ouverture === 2) {
            if (deplacementPossible(posI, posJ, posI, parseInt(posJ + 1), walls)) {
                ouverture++;
                return new Move('move', (parseInt(posBotFixed) + 1).toString());
            }
        } else if (ouverture === 3) {
            if (putWall(gameState, (parseInt(posBotFixed) +1).toString(), 1) !== false) {
                ouverture++;
                return putWall(gameState, (parseInt(posBotFixed) +1).toString(), 1);
            }
        }else if (ouverture === 4) {
            if (putWall(gameState, (parseInt(posBotFixed) -1).toString(), 1) !== false) {
                ouverture++;
                return putWall(gameState, (parseInt(posBotFixed) - 1).toString(), 1);
            }
        }
    }
    ouverture =99;
    return nextMove(gameState);

}


function allchemin(posJoueur, board, player, walls) {


    if (player == "bot") {
        var possiblesMoves = validMoves(positionBot[0], positionBot[1],board,walls);
    } else {
        var possiblesMoves = validMoves(positionOpponent[0], positionOpponent[1],board,walls);
    }

    var tab = hashMapVoisin(board, walls);
    var tabRes = [];
    for (var i = 0; i < possiblesMoves.length; i++) {
        dijkstraVisitedNode = [];
        if (player === "bot") {
            tabRes.push(dijkstraNode(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab));
        } else {
            tabRes.push(dijkstraNode(IAplay == 1 ? "playerB" : "playerA", possiblesMoves[i], tab));
        }

    }
    if (tabRes.length === 1) {
        if (player === "bot") {
            if (!checkBonDeplacement(tabRes[0], tab)) {

                return "idle"; //mouvement pas bon
            }
        }
    }
    var indice = 999;
    var longueur = 999;
    for (var i = 0; i < tabRes.length; i++) {
        if (tabRes[i] != null && tabRes[i].length < longueur) {
            longueur = tabRes[i].length;
            indice = i;
        }
    }
    tabRes.sort(comparerTaille);
    if (indice === 999) {
        return "idle"; //impossible de bouger
    }
    return tabRes;
}
function comparerTaille(a, b) {
    return a.length - b.length;
}
function determineOpponentPosition(gameState){
    //console.log("opponentNextMove : " + opponentNextMove);
    for(var i = 0; i<opponentNextMove.length;i++){
        var posI = opponentNextMove[i][0];
        var posY = opponentNextMove[i][1];
        //console.log(gameState.board[posI][posY]);
        if( gameState.board[posI][posY] == -1){

            positionOpponent = opponentNextMove[i];
            return;
        }

    }
}

function couloirBot(gameState,walls){

    var possiblesMoves = validMoves(positionBot[0], positionBot[1],gameState.board,walls);


    var tab = hashMapVoisin(gameState.board, walls);
    var chemins = [];
    for (var i = 0; i < possiblesMoves.length; i++) {
        dijkstraVisitedNode = [];

        chemins.push(dijkstraNode(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab));


    }

    chemins.sort(comparerTaille);


    var tmp = [];
    for (var i = 0; i < possiblesMoves.length; i++) {
        var path = null;
        dijkstraVisitedNode = [];
        if(possiblesMoves[i] !== chemins[0][0]){

            path = dijkstraNodeUniquePath(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab,chemins[0])
        }
        if(path != null)
            tmp.push(path);
    }
    tmp.push(chemins[0]);
    tmp.sort(comparerTaille);

    //console.log( tmp);
    if(tmp.length>0){
        //tester de placer des murs de partout jusqua voir si je peux n'avoir qu'un seul chemin minimale
        var resulat =   verifPutWallToOneWay(gameState,tmp[0]);

        //console.log("resultat de one way = " + resulat);

        var retour = new Move("wall",resulat);
        return retour;
    }
    return new Move("wall",false);

}

function dijkstraNodeUniquePath(player, start, graph,chemin) {
    const queue = [[start]];
    const visited = new Set([start]);
    for(var i =0;i<chemin.length;i++){
        visited.add(chemin[i]);
    }

    const lanePlayerAArray = ['00', '10', '20', '30', '40', '50', '60', '70', '80'];
    const lanePlayerBArray = ['08', '18', '28', '38', '48', '58', '68', '78', '88'];
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];


        if (player === 'playerA') {
            if (lanePlayerBArray.includes(node)) {
                dijkstraVisitedNode = visited;
                return path;
            }
        }
        if (player === 'playerB') {
            if (lanePlayerAArray.includes(node)) {
                dijkstraVisitedNode = visited;
                return path;
            }
        }
        const neighbors = graph[node];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }

    return null; // No path found
}

function verifPutWallToOneWay(gameState, cheminMinimale) {

    if (nbWalls > 0) {


        const walls = gameState.opponentWalls.concat(gameState.ownWalls);
        var murPossibles = [];
        for (var x = 1; x <= 8; x++) {
            for (var y = 2; y <= 9; y++) {
                for (var orientation = 0; orientation < 2; orientation++) {

                    var newPosI =x;
                    var newPosY = y;

                    if (newPosI <= 0 || newPosI >= 9 || newPosY <=1 || newPosY >= 10) {

                    } else {

                        var newPos = newPosI.toString() + newPosY.toString();
                        let posInInt = parseInt(newPos);
                        var murOk = true;
                        if(!hasWallAdjacent(posInInt,orientation,walls)){
                            murOk = false;
                        }
                        if (murOk && walls.length >= 1) {

                            for (let i = 0; i < walls.length; i++) {
                                if (walls[i][0] == posInInt) {

                                    murOk = false;
                                }
                                if (orientation === 0 && ((walls[i][0] === (posInInt + 10).toString() && walls[i][1] === 0) || (walls[i][0] === (posInInt - 10).toString() && walls[i][1] === 0))) {

                                    murOk = false;
                                }
                                if (orientation === 1 &&( (walls[i][0] === (posInInt + 1).toString() && walls[i][1] === 1) || (walls[i][0] === (posInInt - 1).toString() && walls[i][1] === 1))) {

                                    murOk = false;
                                }
                            }
                        }
                        if(murOk) {
                            walls.push(new Array(newPos, orientation));

                            dijkstraVisitedNode = [];

                            var tab = hashMapVoisin(gameState.board, walls);
                            var res1 = 0;
                            if (positionOpponent !== null)
                                res1 = dijkstra1(IAplay == 2 ? "playerA" : "playerB", positionOpponent, tab);
                            else {
                                res1 = 0;
                            }
                            dijkstraVisitedNode = [];
                            var res2 = dijkstra1(IAplay == 1 ? "playerA" : "playerB", positionBot, tab);

                            var res = Math.max(res1, res2);

                            if (res === 0 && murOk) {
                                murPossibles.push(new Array(newPos, orientation));
                            }
                            walls.splice(walls.indexOf(new Array(newPos, orientation)), 1);

                        }
                    }
                }
            }

        }

        var possiblesMoves = validMoves(positionBot[0], positionBot[1],gameState.board,walls);
        var indice = 999;
        var nbSortieInitaiale =0;
        var sortieTrouvee2 = [];
        var tabTMP = hashMapVoisin(gameState.board, walls);

        if(IAplay == 1){
            const lanePlayerBArray = ['08', '18', '28', '38', '48', '58', '68', '78', '88'];
            for(var u = 0;u<lanePlayerBArray.length;u++){
                dijkstraVisitedNode = [];
                for(var k = 0;k<sortieTrouvee2.length;k++){
                    dijkstraVisitedNode.push(sortieTrouvee2[k]);
                }

                var sortieBool = dijkstra1Sortie(cheminMinimale[0],tabTMP,'8');
                if(sortieBool !== -1 ){

                    sortieTrouvee2.push(sortieBool.toString()) ;
                    nbSortieInitaiale ++;
                }


            }
        }else{
            const lanePlayerAArray = ['00', '10', '20', '30', '40', '50', '60', '70', '80'];
            for(var u = 0;u<lanePlayerAArray.length;u++){
                dijkstraVisitedNode = [];
                for(var k = 0;k<sortieTrouvee2.length;k++){
                    dijkstraVisitedNode.push(sortieTrouvee2[k]);
                }
                var sortieBool = dijkstra1Sortie(cheminMinimale[0],tabTMP,'0');
                if(sortieBool !== -1){
                    sortieTrouvee2.push(sortieBool.toString()) ;
                    nbSortieInitaiale ++;
                }

            }
        }
        if(nbSortieInitaiale >= 3 ){
            var premiereSortie = parseInt(sortieTrouvee2[0]);
            var derniereSortie = parseInt(sortieTrouvee2[sortieTrouvee2.length-1]);
            var ecartSortie = Math.abs(derniereSortie - premiereSortie);
            if(cheminMinimale.length>(ecartSortie/10))
                return false;
        }

        //console.log("SortieInitiale : " + nbSortieInitaiale);

        for (var a = 0; a < murPossibles.length; a++) {
            //console.log("murPossibles :" + murPossibles[a]);
            walls.push(murPossibles[a]);


            var tab = hashMapVoisin(gameState.board, walls);
            var chemins = [];
            for (var i = 0; i < possiblesMoves.length; i++) {
                dijkstraVisitedNode = [];
                if(deplacementPossible(positionBot[0], positionBot[1],possiblesMoves[i][0],possiblesMoves[i][1],walls)) {
                    chemins.push(dijkstraNode(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab));
                }

            }

            chemins.sort(comparerTaille);
            //console.log(chemins)
            var taille;
            if(chemins.length === 0){
                taille = 99;
            }
            else{
                taille = chemins[0].length
            }
            if(taille <=cheminMinimale.length) {

                var tmp = [];
                for (var i = 0; i < possiblesMoves.length; i++) {
                    var path = null;
                    dijkstraVisitedNode = [];
                    if(deplacementPossible(positionBot[0], positionBot[1],possiblesMoves[i][0],possiblesMoves[i][1],walls)) {
                        if (possiblesMoves[i] !== chemins[0][0]) {
                            path = dijkstraNodeUniquePath(IAplay == 1 ? "playerA" : "playerB", possiblesMoves[i], tab, chemins[0])
                        }
                    }

                    if (path != null)
                        tmp.push(path);
                }
                tmp.push(chemins[0]);
                if (tmp.length === 1) {

                    //nbsrotire
                    var nbS = 0;
                    var sortieTrouvee = [];
                    if(IAplay == 1){
                        const lanePlayerBArray = ['08', '18', '28', '38', '48', '58', '68', '78', '88'];
                        for(var u = 0;u<lanePlayerBArray.length;u++){
                            dijkstraVisitedNode = [];
                            for(var k = 0;k<sortieTrouvee.length;k++){
                                dijkstraVisitedNode.push(sortieTrouvee[k]);
                            }
                            var sortieBool = dijkstra1Sortie(chemins[0][0],tab,'8');
                            if(sortieBool !== -1){
                                sortieTrouvee.push(sortieBool.toString()) ;

                                nbS ++;
                            }


                        }
                    }else{
                        const lanePlayerAArray = ['00', '10', '20', '30', '40', '50', '60', '70', '80'];
                        for(var u = 0;u<lanePlayerAArray.length;u++){
                            dijkstraVisitedNode = [];
                            for(var k = 0;k<sortieTrouvee.length;k++){
                                dijkstraVisitedNode.push(sortieTrouvee[k]);
                            }
                            var sortieBool = dijkstra1Sortie(chemins[0][0],tab,'0');
                            if(sortieBool !== -1){
                                sortieTrouvee.push(sortieBool.toString()) ;
                                //console.log(sortieBool)
                                nbS ++;
                            }

                        }
                    }

                    if(nbS <=2 && nbS >=1 && (nbS<nbSortieInitaiale)){
                        //console.log("TRRROUUVVEEEEEE   " +murPossibles[a] );
                        //console.log("nbS   " +nbS );
                        indice = a;
                    }

                }
            }

            walls.splice(walls.indexOf(new Array(newPos, orientation)), 1);
        }
        //console.log("res = " + murPossibles[indice]);
        if(indice===999){

            return false;
        }
        return murPossibles[indice];
    }

    return false;
}

function dijkstra1Sortie( cellule, tab,end) {

    if (dijkstraVisitedNode.includes(cellule)) {

        return -1;
    } else if(cellule[1] == end){

        return cellule.toString();
    }else {
        var tmpTab = [];
        dijkstraVisitedNode.push(cellule);

        for (var voisin in tab["" + cellule]) {

            tmpTab.push(dijkstra1Sortie(tab["" + cellule][voisin], tab,end));
        }
        return Math.max.apply(null, tmpTab);
    }
}

function hasWallAdjacent(pos,orientation,walls){
    if(orientation===0){
        for(var i =0;i<walls.length;i++){
            if((walls[i][0] == (parseInt(pos)+1))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)-1))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)+20))&& walls[i][1]=== 0){
                return true;
            }else if((walls[i][0] == (parseInt(pos)-20))&& walls[i][1]=== 0){
                return true;
            }else if((walls[i][0] == (parseInt(pos)+10))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)-10))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)-9))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)-11))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)+11))&& walls[i][1]=== 1){
                return true;
            }else if((walls[i][0] == (parseInt(pos)+9))&& walls[i][1]=== 1){
                return true;
            }

        }
    }else{
        for(var i =0;i<walls.length;i++) {
            if ((walls[i][0] == (parseInt(pos) + 2)) && walls[i][1] === 1) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) - 2)) && walls[i][1] === 1) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) + 10)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) - 10)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) + 1)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) - 1)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) - 9)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) + 11)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) - 11)) && walls[i][1] === 0) {
                return true;
            } else if ((walls[i][0] == (parseInt(pos) + 9)) && walls[i][1] === 0) {
                return true;
            }
        }
    }
    return false;
}

function distanceEntrePositions(pos1,pos2,walls,board){
    //console.log("pos1 : " + pos1 +"  pos2 : " + pos2);
    pos1 = parseInt(pos1)-11;
    if(pos1 <10){
        pos1 = '0' +pos1;
    }
    pos2 = parseInt(pos2)-11;
    if(pos2 <10){
        pos2 = '0' +pos2;
    }
    var graph = hashMapVoisin(board,walls);
    const queue = [[pos1]];
    const visited = new Set([pos1]);
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];

        if(pos2 == node){
            return path.length;
        }
        const neighbors = graph[node];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }

    return 999; // No path found
}



exports.setup = setup;
exports.nextMove = nextMove;
exports.correction = correction;
exports.updateBoard = updateBoard;