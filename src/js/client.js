const player = {
    username: "",
    inQueue: false,
    socketId: "",
};

const socket = io();

const usernameInput = document.getElementById('username');
const waintingArea = document.getElementById('waiting-area');

$("#form").on('submit', function(e) {
    e.preventDefault();
    player.username = usernameInput.value;
    player.inQueue = true;
    player.socketId = socket.id;
    console.log(player);
    
    waintingArea.classList.remove('d-none');
    socket.emit('inQueue', player);
});