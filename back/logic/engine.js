let gameNamespace;

let cells;
let playerAWalls;
let playerBWalls;
let nbWallPlayerA;
let nbWallPlayerB;
let activePlayer;
let tour;
let firstTurn;
let player1Position;
let player2Position;
var dernierTourB;

let rooms = {};
let varRoom = '';

module.exports = function (io) {
    gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {
        
        socket.on('joinGame', () => {
            console.log('joinGame');
            let room = findAvailableRoom();

            if (!room) {
                room = createRoom();
            }

            socket.join(room);
            rooms[room].push(socket.id);
            socket.emit('joinedGame', room);


            if (rooms[room].length === 2) {
                gameNamespace.to(room).emit('startGame', room);
            } else {
                gameNamespace.to(room).emit('firstPlayer');
            }
        });

        socket.on('joinGameWithRoom', (room) => {
            
            let roomId = findAvailableRoomWithId(room);

            varRoom = room;

            socket.join(roomId);
            rooms[roomId].push(socket.id);

            if (rooms[roomId].length === 4) {
                gameNamespace.to(roomId).emit('gameStarted');
                setupGame();
                socket.emit('setupGame');
            }
        });


        socket.on('getPlayersPosition', () => {
           //socket.emit('getPlayersPositionResponse', player1Position, player2Position);
           gameNamespace.to(varRoom).emit('getPlayersPositionResponse', player1Position, player2Position);
        });

        socket.on('addCellFirtTime', (cell) => {
            cells = cell;
            //socket.emit('setupTheGame');
            gameNamespace.to(varRoom).emit('setupTheGame');
        });

        socket.on('setUpGame', () => {
            //socket.emit('setUpGameResponse', activePlayer, nbWallPlayerA, nbWallPlayerB, player1Position, player2Position, tour, cells);
            gameNamespace.to(varRoom).emit('setUpGameResponse', activePlayer, nbWallPlayerA, nbWallPlayerB, player1Position, player2Position, tour, cells);
        });

        socket.on('endSetupGame', () => {
            //socket.emit('game', player1Position, player2Position, cells, playerAWalls, playerBWalls, nbWallPlayerA, nbWallPlayerB, activePlayer, tour, firstTurn, dernierTourB);
            gameNamespace.to(varRoom).emit('game', player1Position, player2Position, cells, playerAWalls, playerBWalls, nbWallPlayerA, nbWallPlayerB, activePlayer, tour, firstTurn, dernierTourB);
        });

        socket.on('saveToBack', (activePl, nbWallPA, nbWallPB, p1Position, p2Position, lap, cels, pAWalls, pBWalls, firstLap, lastTourB) => {
            activePlayer = activePl;
            nbWallPlayerA = nbWallPA;
            nbWallPlayerB = nbWallPB;
            player1Position = p1Position;
            player2Position = p2Position;
            tour = lap;
            cells = cels;
            playerAWalls = pAWalls;
            playerBWalls = pBWalls;
            firstTurn = firstLap;
            dernierTourB = lastTourB;
        });

        socket.on('disconnect',  () => {
            
        });
    });
};


function setupGame() {
    player1Position = 280;
    player2Position = 8;
    cells = [];
    playerAWalls = [];
    playerBWalls = [];
    nbWallPlayerA = 10;
    nbWallPlayerB = 10;
    activePlayer = 'playerA';
    tour = 202;
    firstTurn = true;
    dernierTourB = false;
}

function findAvailableRoom() {
    for (let room in rooms) {
        if (rooms[room].length < 2) {
            return room;
        }
    }
    return null;
}

function findAvailableRoomWithId(roomId) {
    for (let room in rooms){
        if (room === roomId){
            return room;
        }
    }
    return null;
}

function createRoom() {
    const room = 'room' + (Math.random() * 1000).toFixed(0);
    rooms[room] = [];
    return room;
}


