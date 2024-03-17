let gameNamespace;
let sockets;

let board = [];
let playerAWalls = [];
let playerBWalls = [];
let nbWallPlayerA = 10;
let nbWallPlayerB = 10;
let activePlayer = 'playerA';
let tour = 202;
let firstTurn = true;
let murAPose = new Array(3);



class gameState {
    constructor(ownWalls, opponentWalls, board) {
        this.ownWalls = ownWalls;
        this.opponentWalls = opponentWalls;
        this.board = board;
    }
}

module.exports = function (io) {
    gameNamespace = io.of('/api/game');

    gameNamespace.on('connection', (socket) => {
        sockets=socket;
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
        socket.on('newWall', (pos, grid, validGrid) => {
            socket.emit('wallPlaced', handleWall(pos, grid, validGrid));
        });
        socket.on('newMove', (newMove) => {
            console.log('New move received: ', newMove);
            tour--;
        });
    });

};

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

function handleWall(cellIndex, grid, validGrid) {
    const row = Math.floor(cellIndex / 17);
    const col = cellIndex % 17;

    const clickedCell = cellIndex;
    const rightCell = cellIndex + 1;
    const leftCell = cellIndex - 1;


    if((tour === 202) || (tour === 201)){
        return "firstTurn";
    }



    const upCell = cellIndex - 17;
    const downCell = cellIndex + 17;

    //TODO
    /*if(clickedCell.classList.contains("rotation")){

        return rotationWall(cellIndex);
    }
    var bougerMur = removeWallTmp(clickedCell);
    if (bougerMur && activePlayer === 'playerA') nbWallPlayerA++;
    else if (bougerMur && activePlayer === 'playerB') nbWallPlayerB++;
    if (isClickedCell) {
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    }*/
    if ((activePlayer === 'playerA' && nbWallPlayerA === 0) || (activePlayer === 'playerB' && nbWallPlayerB === 0)) {
        return "noWall";
    }


    var poser = false;
    //pour placer a l'horizontale

    if(validGrid[clickedCell] !==2 && validGrid[rightCell] !==2 && validGrid[leftCell] !==2) {
        //clickedCell.classList.add('wallTMP');
        //clickedCell.classList.add('rotation');
        sockets.emit('wallTMP', clickedCell);
        sockets.emit('rotation', clickedCell);
        murAPose[0] = cellIndex;
        if (col < 16 && validGrid[rightCell] !== 2) {
            //rightCell.classList.add('wallTMP');
            sockets.emit('wallTMP', rightCell);
            murAPose[1] = cellIndex + 1;
        }

        if (col > 0 && validGrid[leftCell] !== 2) {
            //leftCell.classList.add('wallTMP');
            sockets.emit('wallTMP', leftCell);
            murAPose[2] = cellIndex - 1;
        }

        poser = true;
    }

    //pour placer en verticale
    else if((validGrid[clickedCell] !==2 && validGrid[rightCell] !==2 || validGrid[leftCell] !==2)
        && (validGrid[upCell] !== 2 && validGrid[downCell] !== 2))
    {
        //clickedCell.classList.add('wallTMP');
        //clickedCell.classList.add('rotation');
        sockets.emit('wallTMP', clickedCell);
        sockets.emit('rotation', clickedCell);
        murAPose[0] = cellIndex;
        if(col < 16 && validGrid[upCell] !== 2){
            //upCell.classList.add('wallTMP');
            sockets.emit('wallTMP', upCell);
            murAPose[1] = cellIndex-17;
        }
        if(col > 0 && validGrid[downCell] !== 2){
            //downCell.classList.add('wallTMP');
            sockets.emit('wallTMP', downCell);
            murAPose[2] = cellIndex+17;
        }
        poser = true;
    }

    else if(validGrid[clickedCell] !== 2) //la cellule est une ligne
    {
        //horizontale a droite
        if(validGrid[cellIndex + 2] !== 2  && validGrid[cellIndex + 1] !== 2){

            //clickedCell.classList.add('wallTMP');
            sockets.emit('wallTMP', clickedCell);
            murAPose[2] = cellIndex;
            if(col < 16 && validGrid[rightCell] !== 2) {
                //rightCell.classList.add('wallTMP');
                //rightCell.classList.add('rotation');
                sockets.emit('wallTMP', rightCell);
                murAPose[0] = cellIndex+1;
            }
            if(validGrid[cellIndex + 2] !== 2){
                //cells[cellIndex+2].classList.add('wallTMP');
                sockets.emit('wallTMP', cellIndex+2);
                murAPose[1] = cellIndex+2;
            }

            poser = true;

        }
        //horizontale a gauche
        else if(validGrid[cellIndex - 2] !== 2 ){

            //clickedCell.classList.add('wallTMP');
            sockets.emit('wallTMP', clickedCell);
            murAPose[1] = cellIndex;
            if(validGrid[leftCell] !== 2) {
                //cells[cellIndex- 2].classList.add('wallTMP');
                sockets.emit('wallTMP', cellIndex-2);
                murAPose[2] = cellIndex-2;
            }
            if(col > 0 && validGrid[leftCell] !== 2) {
                //leftCell.classList.add('wallTMP');
                //leftCell.classList.add('rotation');
                sockets.emit('wallTMP', leftCell);
                sockets.emit('rotation', leftCell);
                murAPose[0] = cellIndex-1;
            }
            poser = true;
        }
    }
    else if(validGrid[clickedCell] !== 2) //la cellule est une colonne
    {
        if(validGrid[clickedCell - 34] !== undefined && validGrid[clickedCell - 34] !== 2 && validGrid[clickedCell - 17] !== 2){
            //verticale haut
            //clickedCell.classList.add('wallTMP');
            sockets.emit('wallTMP', clickedCell);
            murAPose[2] = cellIndex;
            if(validGrid[clickedCell - 34] !== 2) {
                //cells[cellIndex- 34].classList.add('wallTMP');
                sockets.emit('wallTMP', cellIndex-34);
                murAPose[1] = cellIndex-34;
            }
            if(col > 0 && validGrid[upCell] !== 2) {
                //upCell.classList.add('wallTMP');
                //upCell.classList.add('rotation');
                sockets.emit('wallTMP', upCell);
                sockets.emit('rotation', upCell);
                murAPose[0] = cellIndex-17;
            }
            poser = true;
        }
        else if( validGrid[clickedCell + 34] !== undefined && validGrid[clickedCell + 34] !== 2  && validGrid[clickedCell + 17] !== 2){
            //verticale bas

            //clickedCell.classList.add('wallTMP');
            sockets.emit('wallTMP', clickedCell);
            murAPose[1] = cellIndex;
            if(validGrid[clickedCell + 34] !== 2) {
                //cells[cellIndex+ 34].classList.add('wallTMP');
                sockets.emit('wallTMP', cellIndex+34);
                murAPose[2] = cellIndex+34;
            }
            if(col > 0 && validGrid[downCell] !== 2) {
                //downCell.classList.add('wallTMP');
                //downCell.classList.add('rotation');
                sockets.emit('wallTMP', downCell);
                sockets.emit('rotation', downCell);
                murAPose[0] = cellIndex+17;
            }
            poser = true;
        }
    }

    if(poser) {
        if (activePlayer === 'playerA') {
            nbWallPlayerA--;
            //document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
            sockets.emit('nbWallPlayerA', nbWallPlayerA);
        } else if (activePlayer === 'playerB') {
            nbWallPlayerB--;
            //document.getElementById('nbWallPlayerB').textContent = `Murs restants : ${nbWallPlayerB}`;
            sockets.emit('nbWallPlayerB', nbWallPlayerB);
        }

        /*if(wallPlacable()===0){
            showValider();
        }else{
            alert("Vous ne pouvez pas poser ce mur au risque de bloquer un joueur");
            annulerWall();
        }*/

    }
}

function showValider() {
    var id = "#valider";
    if (activePlayer === 'playerA')
        id += "A";
    else
        id += "B";

    sockets.emit('showValider', id);
}


exports.getValidMoves = getValidMoves;