function computeMove(possibleMoves) {
    let moveIndex = Math.floor(Math.random()*possibleMoves.length);
    return possibleMoves[moveIndex];
}


exports.move = computeMove;