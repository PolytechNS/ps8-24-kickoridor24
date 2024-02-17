var currentWall;
var nbWalls = 10;
var deplacement = 0;

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
    //TODO
    return player2Position;
}
function nextMove(gameState){
    //TODO
    pathFinding()
    console.log("board");
    console.table(gameState.board);
    console.log("murs");
    console.table(gameState.playerAWalls);
    console.table(gameState.playerBWalls);
}
function correction(rightMove){
    //TODO
}
function updateBoard(){
    //TODO
}

function pathFinding(posJoueur,board,walls){

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