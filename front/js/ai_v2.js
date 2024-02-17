var currentWall;
var nbWalls = 10;
var deplacement = 0;
var IAplay;

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
    //TODO
    return player2Position;
}
function nextMove(gameState){
    //TODO

    if(deplacement <= 4){
        var isTunnel = findTunnel(gameState);
        if(isTunnel !== '00'){
            deplacement ++;
            return Promise(putWall(isTunnel, '0'));
        }
    }
    pathFinding()
    //console.log("board");
    //console.table(gameState.board);
    console.log("murs");
    console.table("PlayerA : " + gameState.playerAWalls);
    console.table("PlayerB : " + gameState.playerBWalls);
}
function correction(rightMove){
    //TODO
}
function updateBoard(){
    //TODO
}

function pathFinding(posJoueur,board,walls){

}

function findTunnel(gameState){
    var walls = gameState.playerAWalls.concat(gameState.playerBWalls);
    if(walls.length >= 2){
        if(IAplay === 1){
            const sortedPlayerBWalls = sortTabBiggerFirst(walls);
            for(let i = 0; i < sortedPlayerBWalls.length; i++){
                if(sortedPlayerBWalls[i+1] !== undefined){
                    if((sortedPlayerBWalls[i][0] === '89' && sortedPlayerBWalls[i+1][0] === '87') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i+1][1] === 1)){
                        return '85';
                    }else if((sortedPlayerBWalls[i][0] === '79' && sortedPlayerBWalls[i+1][0] === '77') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i+1][1] === 1)){
                        return '85';
                    }else if((sortedPlayerBWalls[i][0] === '29' && sortedPlayerBWalls[i+1][0] === '27') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i+1][1] === 1)){
                        return '15';
                    }
                    else if((sortedPlayerBWalls[i][0] === '19' && sortedPlayerBWalls[i+1][0] === '17') && (sortedPlayerBWalls[i][1] === 1 && sortedPlayerBWalls[i+1][1] === 1)){
                        return '15';
                    }
                }
            }
        }else if(IAplay === 2){
            const sortedPlayerAWalls = sortTabLowerFirst(walls);
            for(let j = 0; j < sortedPlayerAWalls.length; j++){
                if(sortedPlayerAWalls[j+1] !== undefined){
                    if((sortedPlayerAWalls[j][0] === '12' && sortedPlayerAWalls[j+1][0] === '14') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j+1][1] === 1)){
                        return '16';
                    }else if((sortedPlayerAWalls[j][0] === '22' && sortedPlayerAWalls[j+1][0] === '24') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j+1][1] === 1)){
                        return '16';
                    }else if((sortedPlayerAWalls[j][0] === '72' && sortedPlayerAWalls[j+1][0] === '74') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j+1][1] === 1)){
                        return '86';
                    }
                    else if((sortedPlayerAWalls[j][0] === '82' && sortedPlayerAWalls[j+1][0] === '84') && (sortedPlayerAWalls[j][1] === 1 && sortedPlayerAWalls[j+1][1] === 1)){
                        return '86';
                    }
                }
            }
        }
    }
    return '00';
}

function sortTabBiggerFirst(tab){
    return tab.sort(function (a, b) {
        return b[0] - a[0];
    });
}

function sortTabLowerFirst(tab){
    return tab.sort(function (a, b) {
        return a[0] - b[0];
    });
}

function putWall(pos,orientation){
    return new Move('wall', [pos,orientation]);
}
function dijkstra(player,cellule,tab) {
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
            tmpTab.push(dijkstra(player,tab["" + cellule][voisin], tab));
        }
        return Math.min.apply(null, tmpTab);
    }
}