

function computeMove(pos) {
    console.log("bot : " +pos);
    var possibleMoves = getValidMoves(pos);
    if(possibleMoves.length == 0) return checkNoMove();
    let moveIndex = Math.floor(Math.random()*possibleMoves.length);

    movePlayer(pos);

    movePlayer(possibleMoves[moveIndex]);
    return possibleMoves[moveIndex];
}