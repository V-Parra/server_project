const player = {
    username: "",
    inQueue: false,
    socketId: "",
    enterAt: new Date(),
};

const socket = io();
const gameCard = document.getElementById('game-card');
const usernameInput = document.getElementById('username');
const waintingArea = document.getElementById('waiting-area');
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
    if (games.playerId1[0] != player.username)
    console.log(`Vous jouez contre ${games.playerId1[0]}`);
    if (games.playerId1[1] != player.username) 
    console.log(`Vous jouez contre ${games.playerId1[1]}`);
    startGame(games);
});

function startGame(games) {
    gameCard.classList.remove('d-none');

    const ennemyPlayer = games.playerId1.find(p => p.socketId != player.socketId);
    ennemyUsername = ennemyPlayer.username;

   /* if(player.host && player.turn) {
    SetTurnMessage('alert')
    }*/

  /*  function SetTurnMessage(classToRemove, classToAdd, html){
        turnMsg.classList.remove(classToRemove);
        turnMsg.classList.add(classToAdd);
        turnMsg.innerHTML = html;
    }*/
}

