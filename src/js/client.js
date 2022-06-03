const player = {
    username: "",
    inQueue: false,
    socketId: "",
    enterAt: new Date(),
};

const socket = io();

const usernameInput = document.getElementById('username');
const waintingArea = document.getElementById('waiting-area');
var date_now = Date.now();

$("#form").on('submit', function(e) {
    e.preventDefault();
    player.username = usernameInput.value;
    player.inQueue = true;
    player.socketId = socket.id;
    player.enterAt = Date.now();
    
    waintingArea.classList.remove('d-none');
    socket.emit('inQueue', player);
});