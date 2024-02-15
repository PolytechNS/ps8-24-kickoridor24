function setup(AIplay){
    //setup(AIplay) which takes 1 argument whose value is 1 if your AI is the first player, or 2 if it should play second.
    // This function has to return a Promise that is resolved into a position string (see below), indicating its placement,
    // in less than 1000ms.
    if(AIplay === 1){
        return Promise.resolve("59");
    }else if(AIplay === 2){
        return Promise.resolve("15");
    }
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

exports.setupAI = setup;
exports.nextMoveAI = nextMove;
exports.correctionAI = correction;
exports.updateBoardAI = updateBoard;
