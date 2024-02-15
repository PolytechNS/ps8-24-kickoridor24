module.exports = function(io) {
    const gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {
        console.log('A user connected');
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
        socket.on('newMove', (newMove) => {
            console.log('New move received: ', newMove);
        });
    });
};




function getValidMoves(activePlayer,position, grid, validGrid) {
    position = position - 1;
    const row = Math.floor(position / 17);
    const col = position % 17;
    const moves = [];

    const cellFowardPlus1 = grid[position + 34];
    const cellBackwardPlus1 = grid[position - 34];
    const cellLeftPlus1 = grid[position - 2];
    const cellRightPlus1 = grid[position + 2];

    if (row > 0 && validGrid[position - 17] !== 2){
        if(cellBackwardPlus1 === 1){
            if(validGrid[position - 51] !== 2)
                moves.push(position - 66);
        } else
            moves.push(position - 32);
    }
    if (row < 16 && validGrid[position + 17] !== 2){
        if(cellFowardPlus1 === 1){
            if(validGrid[position + 51] !== 2)
                moves.push(position + 70);
        } else
            moves.push(position + 36);
    }
    if (col > 0 && validGrid[position - 1] !== 2){
        if(cellLeftPlus1 === 1){
            if(validGrid[position - 3] !== 2)
                moves.push(position - 4);
        } else
            moves.push(position);
    }
    if (col < 16 && validGrid[position + 1] !== 2){
        if(cellRightPlus1 === 1){
            if(validGrid[position + 3] !== 2)
                moves.push(position + 6);
        } else
            moves.push(position + 4);
    }
    return moves;
}

exports.getValidMoves = getValidMoves;