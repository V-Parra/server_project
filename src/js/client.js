const player = {
    username: "",
    inGame: false,
    idGame: "",
    socketId: "",
    symbole: 'X',
    enterAt: new Date(),
    turn: false,
    playedCell: "",
    win: false,
};

const socket = io();
const gameCard = document.getElementById('game-card');
const userCard = document.getElementById('user-card');
const usernameInput = document.getElementById('username');
const waintingArea = document.getElementById('waiting-area');
const turnMsg = document.getElementById('turn-message');
var date_now = Date.now();

let ennemyUsername = ""

$("#form").on('submit', function(e) {
    e.preventDefault();
    player.username = usernameInput.value;
    player.socketId = socket.id;
    waintingArea.classList.remove('d-none');
    socket.emit('goInQueue', player);
    console.log(player);
});

socket.on('matchFound', (game) => {
    if (game.player1.id != player.socketId){
    console.log(`Vous jouez contre ${game.player1.username}`);
    } else if (game.player2.id != player.socketId){
    console.log(`Vous jouez contre ${game.player2.username}`);
    }
    startGame(game);
});

$(".cell").on('click', function (e) {
    const playedCell = this.getAttribute('id');

    if (this.innerText === "" && player.turn ) {
        player.playedCell = playedCell;
        this.innerText = player.symbole;
        player.win = calculateWin(playedCell);
        player.turn = false;

        socket.emit('play', player);
    };
});

socket.on('play', (playerEnnemy) => {
    console.log(playerEnnemy.idGame);
    console.log(playerEnnemy.playedCell);
    if (playerEnnemy.socketId !== player.socketId && !playerEnnemy.turn) {
        const playedCell = document.getElementById(`${playerEnnemy.playedCell}`);
        playedCell.classList.add('text-danger');
        playedCell.innerHTML = 'O';

        if (playerEnnemy.win) {
            SetTurnMessage('alert-info', 'alert-danger', `C'est perdu ! <b>${playerEnnemy.username} à gagné`);
            calculateWin(playerEnnemy.playedCell, 'O');
            return;
        };

        if (equalityGame()) {
            updateTurnMessage('alert-info', 'alert-warning', "C'est une égalité");
            return;
        };
        updateTurnMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
    } else {
        if (player.win) {
            $("#turn-message").addClass('alert-success').html("Félicitation, vous avez gagné !");
            return;
        };

        if (equalityGame()) {
            updateTurnMessage('alert-info', 'alert-warning', "C'est une égalité");
            return;
        }; 
        updateTurnMessage('alert-info', 'alert-success', `C'est au tour de <b>${ennemyUsername}</b> de jouer`);
        player.turn = false;
    };
});

function equalityGame() {
    let equality = true;
    const cells = document.getElementById('cell');

    for(const cell of cells) {
        if (cell.textContent === '') {
            equality = false;
        };
    };
    return equality;
};

function calculateWin(playedCell, symbol = player.symbole) {
    let row = playedCell[5];
    let column = playedCell[7];

    let win = true;

    for (let i = 1; i < 4; i++) {
        if ($(`#cell-${i}-${column}`).text() !== symbol) {
            win = false;
        }
    }

    if (win) {
        for (let i = 1; i < 4; i++) {
            $(`#cell-${i}-${column}`).addClass("win-cell");
        }

        return win;
    }

    win = true;
    for (let i = 1; i < 4; i++) {
        if ($(`#cell-${row}-${i}`).text() !== symbol) {
            win = false;
        }
    }

    if (win) {
        for (let i = 1; i < 4; i++) {
            $(`#cell-${row}-${i}`).addClass("win-cell");
        }

        return win;
    }

    win = true;

    for (let i = 1; i < 4; i++) {
        if ($(`#cell-${i}-${i}`).text() !== symbol) {
            win = false;
        }
    }

    if (win) {
        for (let i = 1; i < 4; i++) {
            $(`#cell-${i}-${i}`).addClass("win-cell");
        }

        return win;
    }

    // 3) SECONDARY DIAGONAL

    win = false;
    if ($("#cell-1-3").text() === symbol) {
        if ($("#cell-2-2").text() === symbol) {
            if ($("#cell-3-1").text() === symbol) {
                win = true;

                $("#cell-1-3").addClass("win-cell");
                $("#cell-2-2").addClass("win-cell");
                $("#cell-3-1").addClass("win-cell");

                return win;
            }
        }
    }
}

function startGame(games) {

    let ennemyPlayer = "";
    player.inGame = true;
    player.idGame = games.idGame;
    

    gameCard.classList.remove('d-none');
    waintingArea.classList.add('d-none');
    userCard.classList.add('d-none');
    turnMsg.classList.remove('d-none');

    if (player.socketId != games.player1.id) {
        ennemyPlayer = games.player1.username;
    } else {
        ennemyPlayer = games.player2.username;
    };

    if (player.username == games.player1.username) {
        player.turn = true;
    };
    
    ennemyUsername = ennemyPlayer;
    console.log(ennemyUsername);

    if(player.turn) {
    SetTurnMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
    } else {
        SetTurnMessage('alert-success', 'alert-info', "C'est au tour de l'adversaire");
    };

    
};

function SetTurnMessage(classToRemove, classToAdd, html){
    turnMsg.classList.remove(classToRemove);
    turnMsg.classList.add(classToAdd);
    turnMsg.innerHTML = html;
};

