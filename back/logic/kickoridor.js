function setup(AIplay){
    //1 if the bot start, 2 if he start second
}

function nextMove(gameState){
    //which takes 1 argument which is a gameState object (see below) representing the state of the game after
    //your opponent's action. This function has 200ms to return a Promise that is resolved into a move object
    //representing your AI's next move.
}

function correction(rightMove) {
    //which takes 1 argument which is a move object. This function will be called if your AI sent an impossible
    //move, to give you the random move you did instead (if your AI tries to play an impossible move, a random
    //legal move will be played instead by the server). This function has 50ms to return a Promise that is resolved
    //into the boolean true, indicating it is ready to continue
}

function updateBoard(gameState) {
    //taking 1 argument which is a gameState object representing the state of the game after your move.
    //The function must return a Promise resolved into the boolean true in 50ms maximum.
}
