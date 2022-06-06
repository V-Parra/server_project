const player = {
    username: "",
    inQueue: false,
    socketId: "",
    symbole: 'X',
    enterAt: new Date(),
    trun: false,
    playedCell: "",
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
    player.inQueue = true;
    player.socketId = socket.id;
    waintingArea.classList.remove('d-none');
    socket.emit('inQueue', player);
    console.log(player);
});

socket.on('foundGame', (games) => {
    if (games.playerUsername[0] != player.username){
    console.log(`Vous jouez contre ${games.playerUsername[0]}`);
    }else if (games.playerUsername[1] != player.username){
    console.log(`Vous jouez contre ${games.playerUsername[1]}`);
    }
    // gameCard.classList.remove('d-none');
    startGame(games);
});

function startGame(games) {
    gameCard.classList.remove('d-none');
    waintingArea.classList.add('d-none');
    userCard.classList.add('d-none');
    turnMsg.classList.remove('d-none');

    const ennemyPlayer = games.playerId1.find(p => p.socketId != player.socketId);
    ennemyUsername = ennemyPlayer.username;
    // console.log(ennemyUsername);

    if(player.turn) {
    SetTurnMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
    } else {
        SetTurnMessage('alert-success', 'alert-info', "C'est au tour de l'adversaire");
    };

    
}

function SetTurnMessage(classToRemove, classToAdd, html){
    turnMsg.classList.remove(classToRemove);
    turnMsg.classList.add(classToAdd);
    turnMsg.innerHTML = html;
}

