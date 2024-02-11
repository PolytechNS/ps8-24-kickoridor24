function computeMove(pos) {
    console.log("bot : " +pos);
    var possibleMoves = getValidMoves(pos);
    let moveIndex = Math.floor(Math.random()*possibleMoves.length);
    console.log("move : " +possibleMoves[moveIndex]);
    movePlayer(pos);
    movePlayer(possibleMoves[moveIndex]);
    return possibleMoves[moveIndex];
}
exports.move = computeMove;