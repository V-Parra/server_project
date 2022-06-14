const bot = {
    username: "",
    inGame: false,
    idGame: "",
    symbole: 'X',
    turn: false,
    playedCell: "",
    win: false,
    ennemyplayer: "",
}

function generateId() {
    return Math.random().toString(36).substring(2, 9);
};

// module.exports = { bot, generateId }; 