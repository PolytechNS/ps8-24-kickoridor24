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


const clients = {};

module.exports = function (io) {
    gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {


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


            } else {

                gameNamespace.to(room).emit('firstPlayer');
            }
        });
        socket.on("changePage", () => {
            const room = findRoomBySocketId(socket.id);
            socket.leave(room);
            rooms[room].splice(socket.id, 1);
        });
        socket.on('joinGameWithRoom', (room) => {

            let roomId = findAvailableRoomWithId(room);

            varRoom = room;

            socket.join(roomId);
            rooms[roomId].push(socket.id);

            if (rooms[roomId].length === 2) {

                gameNamespace.to(roomId).emit('gameStarted');
                //gameNamespace.to(roomId).emit('setupGame');

            }
           });

        socket.on('login', (userId) => {
            console.log('Utilisateur', userId, 'connecté');
            // Associer l'ID de l'utilisateur à sa socket
            clients[userId] = socket;

       
        socket.on('message', (data) => {
            const { senderId, ami, message } = data;
            console.log(data);
            console.log('Message de', senderId, 'à', ami, ':', message);

            // Notifier le destinataire s'il est connecté
            if (clients[ami]) {
                clients[ami].emit('newMessage', { senderId, message });
            }
        });
        socket.on('getPlayersPosition', () => {
            //socket.emit('getPlayersPositionResponse', player1Position, player2Position);
            gameNamespace.to(varRoom).emit('getPlayersPositionResponse', player1Position, player2Position);
           //console.log('getPlayersPosition');
           //socket.emit('getPlayersPositionResponse', player1Position, player2Position);

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


        socket.on('endSetupGame', (currentpalyer) => {
            console.log(socket.id + "  " + currentpalyer)
            const room = findRoomBySocketId(socket.id);
            console.log(rooms[room].length)
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


        socket.on('saveToBackOnline', (activePl, nbWallPA, nbWallPB, p1Position, p2Position, lap, cels, pAWalls, pBWalls, firstLap, lastTourB) => {
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
            const room = findRoomBySocketId(socket.id);
            gameNamespace.to(room).emit('MajOnline', player1Position, player2Position, cells, playerAWalls, playerBWalls, nbWallPlayerA, nbWallPlayerB, activePlayer, tour, firstTurn, dernierTourB);

        });


        socket.on('disconnect', () => {

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