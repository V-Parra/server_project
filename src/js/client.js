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
    ennemyPlayer: "",
    playedAlone: false,
};

const bot = {
    username: "bot",
    symbole: 'O',
    turn: false,
    playedCell: "",
    win: false,
}

const socket = io();
const inputCard = document.getElementById("input-card")
const chat = document.getElementById("chat-card");
const gameCard = document.getElementById('game-card');
const userCard = document.getElementById('user-card');
const usernameInput = document.getElementById('username');
const waintingArea = document.getElementById('waiting-area');
const turnMsg = document.getElementById('turn-message');
var date_now = Date.now();


let ennemyUsername = ""

$("#form").on('submit', function (e) {
    e.preventDefault();
    player.username = usernameInput.value;
    player.socketId = socket.id;
    waintingArea.classList.remove('d-none');
    inputCard.classList.add('d-none');
    socket.emit('goInQueue', player);
    console.log(player);
});

$("#game-alone").on('submit', function (e) {
    e.preventDefault();
    player.username = usernameInput.value;
    player.playedAlone = true;
    StartGameAgainstBot();

})

socket.on('matchFound', (game) => {
    if (game.player1.id != player.socketId) {
        console.log(`Vous jouez contre ${game.player1.username}`);
    } else if (game.player2.id != player.socketId) {
        console.log(`Vous jouez contre ${game.player2.username}`);
    }
    startGame(game);
});

function randomMove() {
    return Math.floor(Math.random() * 9);
}

$(".cell").on('click', function (e) {
        const playedCell = this.getAttribute('id');
    
        if (player.playedAlone == true) {
            if (this.innerText === "" && player.turn) {
                player.playedCell = playedCell;
                this.innerText = player.symbole;
                player.turn = false;
                bot.turn = true;
                player.win = calculateWin();                
                if (bot.turn == true) {
                    for (let i = 1; i < 10; i++) {
                        const cell = document.getElementById(`${i}`);
                        if (cell.innerText === 'X' || cell.innerText === 'O') {
                            continue;
                        } else {
                            if (cell.innerText === "") {
                                console.log('le bot a jouer')
                                bot.playedCell = randomMove();
                                cell.innerText = bot.symbole;
                                bot.turn = false;
                                player.turn = true;
                                bot.win = calculateWin();
                                break;
                            };
                        };
                    }
                };
            };
            if (player.win) {
                SetTurnMessage('alert-info', 'alert-success', `Vous avez gagné`);
            } else if (bot.win) {
                SetTurnMessage('alert-info', 'alert-danger', `C'est perdu ! <b>${bot.username}<b> à gagné`);
                var li = document.createElement('li');
            li.innerText = `${bot.username} : ` + "Je t'ai baisé " + `${player.username}`;
            document.getElementById('messages').appendChild(li);
            };
            if (equalityGame()) {
                SetTurnMessage('alert-info', 'alert-warning', "C'est une égalité");
            }
        } else {
            if (this.innerText === "" && player.turn) {
                player.playedCell = playedCell;
                this.innerText = player.symbole;
                player.win = calculateWin();
                player.turn = false;
                socket.emit('play', player);
            };
        };
    });

socket.on('play', (playerEnnemy) => {
    if (playerEnnemy.socketId !== player.socketId && !playerEnnemy.turn) {
        const playedCell = document.getElementById(`${playerEnnemy.playedCell}`);
        playedCell.classList.add('text-danger');
        playedCell.innerHTML = 'O';

        if (playerEnnemy.win) {
            SetTurnMessage('alert-info', 'alert-danger', `C'est perdu ! <b>${playerEnnemy.username}<b> à gagné`);
            calculateWin();
            return;
        };

        if (equalityGame()) {
            SetTurnMessage('alert-info', 'alert-warning', "C'est une égalité");
            return;
        };
        SetTurnMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
        player.turn = true;
    } else {
        if (player.win) {
            $("#turn-message").add('alert-success').html("Félicitation, vous avez gagné !");
            return;
        };

        if (equalityGame()) {
            SetTurnMessage('alert-info', 'alert-warning', "C'est une égalité");
            return;
        };
        SetTurnMessage('alert-info', 'alert-success', `C'est au tour de <b>${ennemyUsername}</b> de jouer`);
        player.turn = false;
    };
});

function equalityGame() {
    let equality = true;
    const cells = document.getElementsByClassName('cell');

    for (const cell of cells) {
        if (cell.textContent === '') {
            equality = false;
        };
    };
    return equality;
};

function calculateWin() {

    let win = false;
    const cell1 = document.getElementById('1');
    const cell2 = document.getElementById('2');
    const cell3 = document.getElementById('3');
    const cell4 = document.getElementById('4');
    const cell5 = document.getElementById('5');
    const cell6 = document.getElementById('6');
    const cell7 = document.getElementById('7');
    const cell8 = document.getElementById('8');
    const cell9 = document.getElementById('9');

    if (cell1.innerText === "X" && cell2.innerText === "X" && cell3.innerText === "X" || cell1.innerText === 'O' && cell2.innerText === 'O' && cell3.innerText === 'O') {
        cell1.classList.add("win-cell");
        cell2.classList.add("win-cell");
        cell3.classList.add("win-cell");
        player.turn = false;
        bot.turn = false;
        win = true
    }
    if (cell4.innerText === "X" && cell5.innerText === "X" && cell6.innerText === "X" || cell4.innerText === 'O' && cell5.innerText === 'O' && cell6.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell4.classList.add("win-cell");
        cell5.classList.add("win-cell");
        cell6.classList.add("win-cell");
    }
    if (cell7.innerText === "X" && cell8.innerText === "X" && cell9.innerText === "X" || cell7.innerText === 'O' && cell8.innerText === 'O' && cell9.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell7.classList.add("win-cell");
        cell8.classList.add("win-cell");
        cell9.classList.add("win-cell");
    }
    if (cell1.innerText === "X" && cell4.innerText === "X" && cell7.innerText === "X" || cell1.innerText === 'O' && cell4.innerText === 'O' && cell7.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell1.classList.add("win-cell");
        cell4.classList.add("win-cell");
        cell7.classList.add("win-cell");
    }
    if (cell2.innerText === "X" && cell5.innerText === "X" && cell8.innerText === "X" || cell2.innerText === 'O' && cell5.innerText === 'O' && cell8.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell2.classList.add("win-cell");
        cell5.classList.add("win-cell");
        cell8.classList.add("win-cell");
    }
    if (cell3.innerText === "X" && cell6.innerText === "X" && cell9.innerText === "X" || cell3.innerText === 'O' && cell6.innerText === 'O' && cell9.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell3.classList.add("win-cell");
        cell6.classList.add("win-cell");
        cell9.classList.add("win-cell");
    }
    if (cell1.innerText === "X" && cell5.innerText === "X" && cell9.innerText === "X" || cell1.innerText === 'O' && cell5.innerText === 'O' && cell9.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell1.classList.add("win-cell");
        cell5.classList.add("win-cell");
        cell9.classList.add("win-cell");
    }
    if (cell3.innerText === "X" && cell5.innerText === "X" && cell7.innerText === "X" || cell3.innerText === 'O' && cell5.innerText === 'O' && cell7.innerText === 'O') {
        win = true
        player.turn = false;
        bot.turn = false;
        cell3.classList.add("win-cell");
        cell5.classList.add("win-cell");
        cell7.classList.add("win-cell");
    }

    return win;
    
}

function StartGameAgainstBot() {
    gameCard.classList.remove('d-none');
    chat.classList.remove('d-none');
    userCard.classList.add('d-none');
    turnMsg.classList.remove('d-none');
    player.turn = true;
    player.ennemyPlayer = bot.username;
}

function startGame(games) {

    if (player.username != games.player1.username) {
        player.ennemyPlayer = games.player1.username;
    } else if (player.username != games.player2.username) {
        player.ennemyPlayer = games.player2.username;
    }
    let ennemyPlayer = "";
    player.inGame = true;
    if (player.socketId != games.player1.id) {
        player.ennemyPlayer = games.player1.id
    } else if (player.socketId != games.player2.id) {
        player.ennemyPlayer = games.player2.id
    }


    gameCard.classList.remove('d-none');
    waintingArea.classList.add('d-none');
    userCard.classList.add('d-none');
    turnMsg.classList.remove('d-none');
    chat.classList.remove('d-none');

    if (player.socketId != games.player1.id) {
        ennemyPlayer = games.player1.username;
    } else {
        ennemyPlayer = games.player2.username;
    };

    if (player.username == games.player1.username) {
        player.turn = true;
    };

    ennemyUsername = ennemyPlayer;

    if (player.turn) {
        SetTurnMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
    } else {
        SetTurnMessage('alert-success', 'alert-info', "C'est au tour de l'adversaire");
    };
};

function SetTurnMessage(classToRemove, classToAdd, html) {
    turnMsg.classList.remove(classToRemove);
    turnMsg.classList.add(classToAdd);
    turnMsg.innerHTML = html;
};

function recieve(msg, player) {
    var li = document.createElement('li');
    li.innerText = `${player.username} : ` + msg;
    document.getElementById('messages').appendChild(li);
}

$(".buttonSend").on('click', function () {
    var text = document.getElementById('m').value;
    socket.emit('chat message', text, player);
    console.log(`${player.username} : ${text}`);
})

socket.on('chat message', (msg, player) => {
    recieve(msg, player);
});

