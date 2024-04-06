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

function findAvailableRoom() {
    console.log('findAvailableRoom');
    for (let room in rooms) {
        if (rooms[room].length < 2) {
            return room;
        }
    }
    return null;
}

function createRoom() {
    console.log('createRoom');
    const room = 'room' + (Math.random() * 1000).toFixed(0);
    rooms[room] = [];
    return room;
}




module.exports = function (io) {
    gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {
        console.log('a user connected');
        setupGame();
        socket.emit('setupGame');


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
                for (let room in rooms) {
                    let index = rooms[room].indexOf(socket.id);
                    if (index !== -1) {
                        rooms[room].splice(index, 1);
                        if (rooms[room].length === 0) {
                            delete rooms[room];
                        }
                        break;
                    }
                }
            } else {
                gameNamespace.to(room).emit('firstPlayer');
            }
        });

        socket.on('joinGameWithRoom', (room) => {
            console.log('joinGameWithRoom');
            socket.join(room);
            rooms[room].push(socket.id);

            if (rooms[room].length === 2) {
                gameNamespace.to(room).emit('gameStarted');
            }
        });


        socket.on('getPlayersPosition', () => {
           console.log('getPlayersPosition');
           socket.emit('getPlayersPositionResponse', player1Position, player2Position);

        });

        socket.on('addCellFirtTime', (cell) => {
            console.log('addCellFirtTime');
            cells = cell;
            socket.emit('setupTheGame');
        });

        socket.on('setUpGame', () => {
            console.log('setUpGame');
            socket.emit('setUpGameResponse', activePlayer, nbWallPlayerA, nbWallPlayerB, player1Position, player2Position, tour, cells);
        });

        socket.on('endSetupGame', () => {
            console.log('endSetupGame');
            socket.emit('game', player1Position, player2Position, cells, playerAWalls, playerBWalls, nbWallPlayerA, nbWallPlayerB, activePlayer, tour, firstTurn, dernierTourB);
        });

        socket.on('saveToBack', (activePl, nbWallPA, nbWallPB, p1Position, p2Position, lap, cels, pAWalls, pBWalls, firstLap, lastTourB) => {
            console.log('saveToBack');
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
            console.log('user disconnected');
        });
    });
};


function setupGame() {
    console.log('new game');
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


