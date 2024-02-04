// This function doesn't handle walls.
function computeMove(gameState) {
    let pos = gameState.player.position;
    let possibleMoves = [];
    // Check if moving left is possible.
    var validMoves = getValidMoves(pos);
    if ((pos%17) >= 2) possibleMoves.push(pos-2);
    // Check if moving right is possible.
    if ((pos%17)!= 16) possibleMoves.push(pos+2);
    // Check if moving down is possible.
    if (pos < 255) possibleMoves.push(pos+ 34);
    // Check if moving up is possible.
    if (pos > 16) possibleMoves.push(pos-34);

    // Get a random integer between 0 and possibleMoves.length-1
    let moveIndex = Math.floor(Math.random()*possibleMoves.length);
    movePlayer(possibleMoves[moveIndex]);
    return possibleMoves[moveIndex];
}