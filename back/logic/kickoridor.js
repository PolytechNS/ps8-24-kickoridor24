function setup(AIplay){
    //setup(AIplay) which takes 1 argument whose value is 1 if your AI is the first player, or 2 if it should play second.
    // This function has to return a Promise that is resolved into a position string (see below), indicating its placement,
    // in less than 1000ms.
    if(AIplay === 1){
        return Promise.resolve("41");
    }else if(AIplay === 2){
        return Promise.resolve("49");
    }
}
class Move {
    constructor(action, value) {
        this.action = action;
        this.value = value;
    }
}
var boole = 0;
function nextMove(gameState){
    if(boole ==1) {
        boole = 0;
        return new Promise((resolve, reject) => {
            resolve(new Move("move", "61"));
        });
    }else{boole = 1;
        return new Promise((resolve, reject) => {
            resolve(new Move("move", "51"));
        });
    }
}

function correction(rightMove) {
    //which takes 1 argument which is a move object. This function will be called if your AI sent an impossible
    //move, to give you the random move you did instead (if your AI tries to play an impossible move, a random
    //legal move will be played instead by the server). This function has 50ms to return a Promise that is resolved
    //into the boolean true, indicating it is ready to continue
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}

function updateBoard(gameState) {
    return  new Promise((resolve, reject) => {
        resolve(true);
    });
}

exports.setup = setup;
exports.nextMove = nextMove;
exports.correction = correction;
exports.updateBoard = updateBoard;