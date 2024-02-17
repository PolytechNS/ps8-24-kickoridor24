var currentWall;
var nbWalls = 10;
var deplacement = 0;
var positionBot = 0;
var numeroJoueur = 0;
var walls ;
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

    numeroJoueur = AIplay;
    if(AIplay === 1){
        return "48";
    }else{
        return "40";
    }
    return player2Position;
}
function nextMove(gameState){
    //TODO
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board[i].length; j++) {
           if(gameState.board[i][j] ==+ 1){
                positionBot = i;
                positionBot += ""+j;
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
    if(numeroJoueur === 1){
        ligneFinale = board[8];
    }else{
        ligneFinale = board[0];

    }
 let x =  [...board];
    //  let result =  x.concat(board.reverse().slice(1,board.length));
    console.table(board);
}

function dijkstra(player,cellule,tab,ligneFinale) {
     if (ligneFinale.includes(cellule)) {

            return cellule;
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

function validMoves(positionI,positionJ){
    var mouvement = [];
    const cellRight = (parseInt(positionI)+1) +"" +positionJ;
    const cellLeft =  (parseInt(positionI)-1) +"" +positionJ;
    const cellBackward = positionI +"" +(positionJ-1);
    const cellFoward =positionI +"" +(parseInt(positionJ)+1);

    const cellLeftPlus1 = (positionI-2) +"" +positionJ;
    const cellRightPlus1 = (parseInt(positionI)+2) +"" +positionJ;
    const cellBackwardPlus1 = positionI +"" +(positionJ-2);
    const cellFowardPlus1 =positionI +"" +(parseInt(positionJ)+2);

    if(positionI<8)//impossible de monter sinon
        {
            if(board[cellFoward[0]][cellFoward[1]] === 2){

               if( deplacementPossible(positionI,positionJ, cellFowardPlus1[0],cellFowardPlus1[1]))
                   mouvement.push(cellFowardPlus1);
            }
            else{
               if( deplacementPossible(positionI,positionJ, cellFoward[0],cellFoward[1]))
                   mouvement.push(cellFoward);
            }
        }
    if(positionI>0)//impossible de descendre sinon
        {
            if(board[cellBackward[0]][cellBackward[1]] === 2){

                if(deplacementPossible(positionI,positionJ, cellBackwardPlus1[0],cellBackwardPlus1[1]))
                    mouvement.push(cellBackwardPlus1);
            }
            else{
                if(deplacementPossible(positionI,positionJ, cellBackward[0],cellBackward[1]))
                mouvement.push(cellBackward);
            }
        }
    if(positionJ>0)//impossible d'aller a gauche sinon
        {
            if(board[cellLeft[0]][cellLeft[1]] === 2){

                if(deplacementPossible(positionI,positionJ, cellLeftPlus1[0],cellLeftPlus1[1]))
                    mouvement.push(cellLeftPlus1);
            }
            else{
                if(deplacementPossible(positionI,positionJ, cellLeft[0],cellLeft[1]))
                    mouvement.push(cellLeft);
            }
        }
    if(positionJ<8)//impossible d'aller a droite sinon
        {

            if(board[cellRight[0]][cellRight[1]] === 2){

                if(deplacementPossible(positionI,positionJ, cellRightPlus1[0],cellRightPlus1[1]))
                    mouvement.push(cellRightPlus1);
            }
            else{
                if(deplacementPossible(positionI,positionJ, cellRight[0],cellRight[1]))
                    mouvement.push(cellRight);
            }
        }

}

function deplacementPossible(positionI,positionJ, mouvementI,mouvementJ){
//vérifier que ya pas de mur entre les deux pos
    var deplacementI = positionI - mouvementI;
    var deplacementJ = positionJ - mouvementJ;
    mouvementI++;
    mouvementJ++;//pour les mettres au memes coordonées que les murs
  if(deplacementI ==-1){//deplacement vers la droite
        var murVerticalHaut = ""+  (parseInt(positionI)+1) + (parseInt(positionJ)+2);
        var murVerticalBas = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+1);
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murVerticalBas && walls[x][1] ==1)||
                (walls[x][0] ==murVerticalHaut && walls[x][1] ==1)){
                return false;
            }
        }
        return true;
    }else if(deplacementI ==-2){//deplacement vers la droite avec un saut
        var murVerticalHaut = ""+  (parseInt(positionI)+1) + (parseInt(positionJ)+2);
        var murVerticalBas = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+1);
        var murVerticalHaut2 = ""+  (parseInt(positionI)+2) + (parseInt(positionJ)+2);
        var murVerticalBas2 = ""+(parseInt(positionI)+2)+""+(parseInt(positionJ)+1);
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murVerticalBas && walls[x][1] ==1)||
                (walls[x][0] ==murVerticalHaut && walls[x][1] ==1)
                ||
                (walls[x][0] ==murVerticalHaut2 && walls[x][1] ==1)
                ||
                (walls[x][0] ==murVerticalBas2 && walls[x][1] ==1)){
                return false;
            }
        }
        return true;
    }
    else if(deplacementI ==1){//deplacement vers la gauche
        var murVerticalHaut = ""+  (parseInt(positionI)) + (parseInt(positionJ)+2);
        var murVerticalBas = ""+(parseInt(positionI))+""+(parseInt(positionJ)+1);

        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murVerticalBas && walls[x][1] ==1)||
                (walls[x][0] ==murVerticalHaut && walls[x][1] ==1)){
                return false;
            }
        }
        return true;
    }
    else if(deplacementI ==2){//deplacement vers la gauche avec un saut
        var murVerticalHaut = ""+  (parseInt(positionI)) + (parseInt(positionJ)+2);
        var murVerticalBas = ""+(parseInt(positionI))+""+(parseInt(positionJ)+1);
        var murVerticalHaut2 = ""+  (parseInt(positionI)-1) + (parseInt(positionJ)+2);
        var murVerticalBas2 = ""+(parseInt(positionI)-1)+""+(parseInt(positionJ)+1);
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murVerticalBas && walls[x][1] ==1)||
                (walls[x][0] ==murVerticalHaut && walls[x][1] ==1)
                ||
                (walls[x][0] ==murVerticalHaut2 && walls[x][1] ==1)
                ||
                (walls[x][0] ==murVerticalBas2 && walls[x][1] ==1)){
                return false;
            }
        }
        return true;
    }
    else if(deplacementJ ==1){//deplacement vers le bas
        var murHorizontaleGauche = ""+  (parseInt(positionI)) + (parseInt(positionJ)+1);
        var murHorizontaleDroit = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+1);
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murHorizontaleGauche && walls[x][1] ==0)||
                (walls[x][0] ==murHorizontaleDroit && walls[x][1] ==0)){
                return false;
            }
        }
        return true;
    }
    else if(deplacementJ ==2){//deplacement vers le bas avec un saut
        var murHorizontaleGauche = ""+  (parseInt(positionI)) + (parseInt(positionJ)+1);
        var murHorizontaleDroit = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+1);
        var murHorizontaleGauche2 = ""+  (parseInt(positionI)) + (parseInt(positionJ));
        var murHorizontaleDroit2 = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ));
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murHorizontaleGauche && walls[x][1] ==0)||
                (walls[x][0] ==murHorizontaleDroit && walls[x][1] ==0)
                ||
                (walls[x][0] ==murHorizontaleGauche2 && walls[x][1] ==0)
                ||
                (walls[x][0] ==murHorizontaleDroit2 && walls[x][1] ==0)){
                return false;
            }
        }
        return true;
    }
    else if(deplacementJ ==-1){//deplacement vers le haut
        var murHorizontaleGauche = ""+  (parseInt(positionI)) + (parseInt(positionJ)+2);
        var murHorizontaleDroit = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+2);
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murHorizontaleGauche && walls[x][1] ==0)||
                (walls[x][0] ==murHorizontaleDroit && walls[x][1] ==0)){
                return false;
            }
        }
        return true;
    } else if(deplacementJ ==-2){//deplacement vers le haut avec un saut
        var murHorizontaleGauche = ""+  (parseInt(positionI)) + (parseInt(positionJ)+2);
        var murHorizontaleDroit = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+2);
        var murHorizontaleGauche2 = ""+  (parseInt(positionI)) + (parseInt(positionJ)+3);
        var murHorizontaleDroit2 = ""+(parseInt(positionI)+1)+""+(parseInt(positionJ)+3);
        for(var x = 0; x<walls.length;x++){
            if((walls[x][0] ==murHorizontaleGauche && walls[x][1] ==0)||
                (walls[x][0] ==murHorizontaleDroit && walls[x][1] ==0)
                ||
                (walls[x][0] ==murHorizontaleGauche2 && walls[x][1] ==0)
                ||
                (walls[x][0] ==murHorizontaleDroit2 && walls[x][1] ==0)){
                return false;
            }
        }
        return true;
    }

    return true;

}