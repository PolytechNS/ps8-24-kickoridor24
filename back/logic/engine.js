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
const clients = {};

module.exports = function (io) {
    gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {

        console.log("llllaaaaa")
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
        socket.on('quitRoom', () => {
            const room = findRoomBySocketId(socket.id);
            if (room) {
                socket.leave(room);
                const index = rooms[room].indexOf(socket.id);
                if (index !== -1) {
                    rooms[room].splice(index, 1);
                }
                // Si la salle est vide après le départ de l'utilisateur, supprimez-la
                if (rooms[room].length === 0) {
                    delete rooms[room];
                }
            }
            });
        socket.on("changePage", () => {
            const room = findRoomBySocketId(socket.id);
            socket.leave(room);
            if(rooms[room])
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

        });
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

            gameNamespace.to(varRoom).emit('getPlayersPositionResponse', player1Position, player2Position);
           //console.log('getPlayersPosition');
           //socket.emit('getPlayersPositionResponse', player1Position, player2Position);

        });
        socket.on('getPlayersPositionOffline', () => {
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


        socket.on('endSetupGame', (currentpalyer) => {

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
        socket.on("VictoireOnline", (txt) => {
            const room = findRoomBySocketId(socket.id);
            const socketsInRoom = io.sockets.adapter.rooms.get(room);

            // Envoyer un événement à chaque socket dans la salle pour supprimer la salle
            if (socketsInRoom) {
                socketsInRoom.forEach(socketId => {
                    io.to(socketId).emit("SupprimerRoom", room);
                });
            }

            delete rooms[room];
            gameNamespace.to(room).emit("FinDePartieOnline",txt);

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


    function findRoomBySocketId(socketId) {
        for (let room in rooms) {
            if (rooms[room].includes(socketId)) {
                return room;
            }
        }
        return null;
    }