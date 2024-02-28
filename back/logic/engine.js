var board = [];
var playerAWalls = [];
var playerBWalls = [];
let gameNamespace;


class gameState {
    constructor(ownWalls, opponentWalls, board) {
        this.ownWalls = ownWalls;
        this.opponentWalls = opponentWalls;
        this.board = board;
    }
}


var tmpLigne = [];

for (i = 0; i < 289; i = i + 2) {
    if (i > 135) {
        n = 0;
    } else {
        n = -1;
    }
    if (i % 34 === 0 && i !== 0) {
        board.push(tmpLigne);
        tmpLigne = [];
    } else if (i % 16 === 0 && i !== 0) {
        i = i + 16;
    }
    tmpLigne.push(n);
}
board.push(tmpLigne);

var gameState1 = new gameState(playerAWalls, playerBWalls, board);

module.exports = function (io) {
    gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {
        console.log('A user connected');
        setupNewGame();
        socket.emit('newGame', gameState1);

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        /*socket.on('computeMoveRandom', (move) => {
            aiRandom.move(move);
        });*/
        socket.on('getValidMoves', (activePlayer, playerPosition, grid, validGrid) => {
            socket.emit('validMoves', getValidMoves(activePlayer, playerPosition, grid, validGrid));
        });
        socket.on('newWall', (newWall) => {
            console.log('New wall received: ', newWall);
        });
        socket.on('newMove', (newMove, pos) => {
            console.log('New move received: ', newMove);
            console.log('Position: ', pos);
        });
    });

};

function setupNewGame() {
    console.log('Setting up new game');
    console.log('gameState1: ', gameState1);
}


function getValidMoves(activePlayer, position, grid, validGrid) {
    position = position - 1;
    const row = Math.floor(position / 17);
    const col = position % 17;
    const moves = [];

    const cellFowardPlus1 = grid[position + 34];
    const cellBackwardPlus1 = grid[position - 34];
    const cellLeftPlus1 = grid[position - 2];
    const cellRightPlus1 = grid[position + 2];

    if (row > 0 && validGrid[position - 17] !== 2) {
        if (cellBackwardPlus1 === 1) {
            if (validGrid[position - 51] !== 2)
                moves.push(position - 66);
        } else
            moves.push(position - 32);
    }
    if (row < 16 && validGrid[position + 17] !== 2) {
        if (cellFowardPlus1 === 1) {
            if (validGrid[position + 51] !== 2)
                moves.push(position + 70);
        } else
            moves.push(position + 36);
    }
    if (col > 0 && validGrid[position - 1] !== 2) {
        if (cellLeftPlus1 === 1) {
            if (validGrid[position - 3] !== 2)
                moves.push(position - 4);
        } else
            moves.push(position);
    }
    if (col < 16 && validGrid[position + 1] !== 2) {
        if (cellRightPlus1 === 1) {
            if (validGrid[position + 3] !== 2)
                moves.push(position + 6);
        } else
            moves.push(position + 4);
    }
    return moves;
}


exports.getValidMoves = getValidMoves;