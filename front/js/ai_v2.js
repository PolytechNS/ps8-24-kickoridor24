var currentWall;
var nbWalls = 10;
var deplacement = 0;
var positionBot = 0;
var walls ;
var IAplay;
var dijkstraVisitedNode = [];
var positionOpponent = null;
class Move {
    constructor(action, value) {
        this.action = action;
        this.value = value;
    }
}


function chooseBestMove(pos){
    console.log("bot : " +pos);
    var possibleMoves = getValidMoves(pos);
    console.log("possible moves : " +possibleMoves);
    //choisir dans possible move le plus petit chiffre
    let moveIndex = 0;
    for (let i = 0; i < possibleMoves.length; i++) {
        if (possibleMoves[i] < possibleMoves[moveIndex]) {
            moveIndex = i;
        }
    }
    console.log("move : " +possibleMoves[moveIndex]);
    movePlayer(pos);
    movePlayer(possibleMoves[moveIndex]);
    deplacement++;
    return possibleMoves[moveIndex];
}

function chooseBestWall(pos){
    if(nbWalls === 10) {
        currentWall = pos + 18;
        handleWall(currentWall);
    }
    else if(nbWalls % 2 === 1){
        currentWall = currentWall + 2;
        handleWall(currentWall);
    }
    else{
        currentWall = currentWall - 2;
        handleWall(currentWall);
    }
}

function chooseAction(pos){
    if(deplacement < 2 || nbWalls === 0){
        chooseBestMove(pos);
    }
    else{
        chooseBestWall(pos);
    }
}

function setup(AIplay){
    console.log("le bot est le joueur numero "+ AIplay );
    IAplay = AIplay;
    deplacement = 0;


    return player2Position;
}
function nextMove(gameState){
    //TODO
    var opponentfound =false;
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board[i].length; j++) {
            if(gameState.board[i][j] === 1){
                positionBot = i;
                positionBot += ""+j;
            }
            if(gameState.board[i][j] === 2){
                positionOpponent = i;
                positionOpponent += ""+j;
                opponentfound = true;
            }
        }
    }

    if(!opponentfound){
        positionOpponent = null;
    }



    if(deplacement <= 4){
        var isTunnel = findTunnel(gameState);
        if(isTunnel !== '00'){
            if(putWall(gameState,isTunnel,0) !== false){
                deplacement++;
                console.log(putWall(gameState,isTunnel,0));
            }else {
                console.log("HASSOUL TUNNEL DEJA BLOQUE");
            }
        }
    }
    walls = gameState.playerAWalls.concat(gameState.playerBWalls);
    pathFinding(positionBot,gameState.board);
    validMoves(positionBot[0],positionBot[1]);

}
function correction(rightMove){
    //TODO
}
function updateBoard(){
    //TODO
}
var dijkstraVisitedNode = [];
function pathFinding(posJoueur,board){
    console.table(walls);
    var ligneFinale = new Array();
    if(IAplay === 1){
        ligneFinale = board[8];
    }else{
        ligneFinale = board[0];

    }
    let x =  [...board];
    //  let result =  x.concat(board.reverse().slice(1,board.length));
    console.table(board);
}



function findTunnel(gameState) {
    var walls = gameState.playerAWalls.concat(gameState.playerBWalls);
    if (walls.length >= 2) {
        if (IAplay === 1) {
            const sortedPlayerBWalls = sortTabBiggerFirst(walls);
            for (let i = 0; i < sortedPlayerBWalls.length; i++) {
                if (sortedPlayerBWalls[i + 1] !== undefined) {
                    if ((sortedPlayerBWalls[i][0] === '89' && sortedPlayerBWalls[i + 1][0] === '87') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        return '85';
                    } else if ((sortedPlayerBWalls[i][0] === '79' && sortedPlayerBWalls[i + 1][0] === '77') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        return '85';
                    } else if ((sortedPlayerBWalls[i][0] === '29' && sortedPlayerBWalls[i + 1][0] === '27') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        return '15';
                    } else if ((sortedPlayerBWalls[i][0] === '19' && sortedPlayerBWalls[i + 1][0] === '17') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i + 1][1] === 1)) {
                        return '15';
                    }
                }
            }
        } else if (IAplay === 2) {
            const sortedPlayerAWalls = sortTabLowerFirst(walls);
            for (let j = 0; j < sortedPlayerAWalls.length; j++) {
                if (sortedPlayerAWalls[j + 1] !== undefined) {
                    if ((sortedPlayerAWalls[j][0] === '12' && sortedPlayerAWalls[j + 1][0] === '14') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
                        return '16';
                    } else if ((sortedPlayerAWalls[j][0] === '22' && sortedPlayerAWalls[j + 1][0] === '24') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
                        return '16';
                    } else if ((sortedPlayerAWalls[j][0] === '72' && sortedPlayerAWalls[j + 1][0] === '74') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
                        return '86';
                    } else if ((sortedPlayerAWalls[j][0] === '82' && sortedPlayerAWalls[j + 1][0] === '84') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j + 1][1] === 1)) {
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
    if (nbWalls > 0) {
        let posInInt = parseInt(pos);
        const walls = gameState.playerAWalls.concat(gameState.playerBWalls);
        if (walls.length >= 1) {
            for (let i = 0; i < walls.length; i++) {
                if (walls[i][0] === pos) {
                    return false;
                }
                if (orientation === 0 && (walls[i][0] === (posInInt + 10).toString() && orientation === 0) || (walls[i][0] === (posInInt - 10).toString() && orientation === 0)) {
                    return false;
                }
                if (orientation === 1 && (walls[i][0] === (posInInt + 1).toString() && orientation === 1) || (walls[i][0] === (posInInt - 1).toString() && orientation === 1)) {
                    return false;
                }
            }
            walls.push(new Array(pos,orientation));
            dijkstraVisitedNode = [];
            console.log(walls);
            var tab = hashMapVoisin(gameState.board,walls);
            var res1 = 0;
            if(positionOpponent !==null)
                res1 = dijkstra1("playerA", positionOpponent, tab);
            else{
                res1 = 0;
            }
            dijkstraVisitedNode = [];
            var res2 = dijkstra1("playerB", positionBot, tab);

            var res = Math.max(res1, res2);
            console.log(res1);
            console.log(res2);
            if (res !== 0) {
                console.log("je peux pas placer la sinon je bloque un joueur");
            } else {
                nbWalls--;
                return new Move('wall', [pos, orientation]);
            }

        }
    }
}

function dijkstra1(player, cellule, tab) {

    const lanePlayerAArray = ['00', '10', '20', '30', '40', '50', '60', '70', '80'];
    const lanePlayerBArray = ['08', '18', '28', '38', '48', '58', '68', '78', '88'];

    if (player === 'playerA') {
        if (lanePlayerBArray.includes(cellule)) {
            console.log("ok");
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


function validMoves(positionI, positionJ) {
    var mouvement = [];
    const cellRight = (parseInt(positionI) + 1) + "" + positionJ;
    const cellLeft = (parseInt(positionI) - 1) + "" + positionJ;
    const cellBackward = positionI + "" + (positionJ - 1);
    const cellFoward = positionI + "" + (parseInt(positionJ) + 1);

    const cellLeftPlus1 = (positionI - 2) + "" + positionJ;
    const cellRightPlus1 = (parseInt(positionI) + 2) + "" + positionJ;
    const cellBackwardPlus1 = positionI + "" + (positionJ - 2);
    const cellFowardPlus1 = positionI + "" + (parseInt(positionJ) + 2);

    if (positionI < 8)//impossible de monter sinon
    {
        if (board[cellFoward[0]][cellFoward[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellFowardPlus1[0], cellFowardPlus1[1],walls))
                mouvement.push(cellFowardPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellFoward[0], cellFoward[1],walls))
                mouvement.push(cellFoward);
        }
    }
    if (positionI > 0)//impossible de descendre sinon
    {
        if (board[cellBackward[0]][cellBackward[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellBackwardPlus1[0], cellBackwardPlus1[1],walls))
                mouvement.push(cellBackwardPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellBackward[0], cellBackward[1],walls))
                mouvement.push(cellBackward);
        }
    }
    if (positionJ > 0)//impossible d'aller a gauche sinon
    {
        if (board[cellLeft[0]][cellLeft[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellLeftPlus1[0], cellLeftPlus1[1],walls))
                mouvement.push(cellLeftPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellLeft[0], cellLeft[1],walls))
                mouvement.push(cellLeft);
        }
    }
    if (positionJ < 8)//impossible d'aller a droite sinon
    {

        if (board[cellRight[0]][cellRight[1]] === 2) {

            if (deplacementPossible(positionI, positionJ, cellRightPlus1[0], cellRightPlus1[1],walls))
                mouvement.push(cellRightPlus1);
        } else {
            if (deplacementPossible(positionI, positionJ, cellRight[0], cellRight[1],walls))
                mouvement.push(cellRight);
        }
    }
    console.log(mouvement);
}

function deplacementPossible(positionI, positionJ, mouvementI, mouvementJ,walls) {
    if(positionI <0 || positionJ<0 || mouvementJ <0 || mouvementI<0 ||
        positionI >8 || positionJ>8 || mouvementJ >8 || mouvementI>8  )
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
function hashMapVoisin(board,walls){
    var tab ={};
    for(var i = 0;i<board.length;i++){

        for (var j = 0;j<board[i].length;j++){
            var tmp = [];
            if(deplacementPossible(i,j,(parseInt(i)+1),j,walls)){
                tmp.push(""+(parseInt(i)+1) +j);
            }
            if(deplacementPossible(i,j,(parseInt(i)-1),j,walls)){
                tmp.push(""+(parseInt(i)-1) +j);
            }
            if(deplacementPossible(i,j,i,(parseInt(j)+1),walls)){
                tmp.push(""+i +(parseInt(j)+1));
            }
            if(deplacementPossible(i,j,i,(parseInt(j)-1),walls)){
                tmp.push(""+i +(parseInt(j)-1));
            }
            tab["" + i+"" + j] = tmp;
        }
    }
    console.log(tab);
    return tab;

}