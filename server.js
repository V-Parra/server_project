
const { Socket } = require('socket.io');
const express = require('express');
const { createPopper } = require('@popperjs/core');
const server = express();
const http = require('http').createServer(server);
const port = 8080;
const path = require('path');
const { db, createAccount, gameCreated } = require('./database');

/**
 * @type {Socket}
 */

const io = require('socket.io')(http);
const body = require('body-parser');
const { threadId } = require('worker_threads');
const res = require('express/lib/response');
const { generatePrimeSync } = require('crypto');
const { throws } = require('assert');


server.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
server.use('/bootstrap/js/', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
server.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io/dist')));
server.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
server.use(express.static('src'));
server.use(body.urlencoded({
    extended: true
}))
server.use(body.json());

class Player {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
}

class Game {
    constructor(idGame, player1, player2) {
        this.idGame = idGame;
        this.player1 = player1;
        this.player2 = player2;
    }
}

class IA {
    constructor(id, username) {
        this.id = id;
        this.usename = username;
    }
}

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});


http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

let games = [];

function checkPLayerIsSchearching() {
    sql = `SELECT user.username, user.socketId FROM user WHERE user.inGame = 0 LIMIT 2`
    let game = new Game;
    let players = [];
    db.query(sql, function (err, res) {
        if (err) throw err;
        if (res.length == 2) {
            let player = new Player(res[0].socketId, res[0].username);
            let player2 = new Player(res[1].socketId, res[1].username);
            players.push(player);
            players.push(player2);
            if (players.length > 1) {
                game = CreateGame(players);
                console.log(`Match created : ${game.player1.username} vs ${game.player2.username}`);
                games.push(game);
                io.to(game.player1.id).emit('matchFound', game);
                io.to(game.player2.id).emit('matchFound', game);
            }
        }
    });
    return game;
};

function CreateGame(players) {
    let game = new Game(generategameId(), players[0], players[1]);
    reqStatutGame = `UPDATE user SET inGame = 1 WHERE socketId = ?`;
    reqCreateGame = `INSERT INTO game (id, player1, player2) VALUES ("${game.idGame}", "${game.player1.id}", "${game.player2.id}")`;
    db.query(reqStatutGame, players[0].id, function (err, res) {
        if (err) throw err;
    });
    db.query(reqStatutGame, players[1].id, function (err, res) {
        if (err) throw err;
    });
    db.query(reqCreateGame, function (err, res) {
        if (err) throw err;
    });
    return game;
};

function generategameId() {
    return Math.random().toString(36).substring(2, 9);
};

// function foundMatch() {
//     let game = new Game();
//     game = checkPLayerIsSchearching();
//     console.log(game);
//     if (game != null) {
//         CreateMatch(game);
//     }
// }


io.on('connection', (socket) => {
    socket.on('goInQueue', (player) => {
        createAccount(player.username, player.socketId, player.inGame, player.enterAt);
        checkPLayerIsSchearching();
    })
});
