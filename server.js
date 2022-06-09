
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

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});


http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

function checkPLayerIsSchearching() {
    let counter = 0;
    if (counter <= 1) {
        callback();
        return;
    }
    sql = `SELECT user.username, user.socketId FROM user WHERE user.inGame = 0 LIMIT 2`
    let game = new Game;
    try {
        let players = [];
        let reader = db.query(sql, function (err, res) {
            if (err) throw err;
            // var resData = JSON.parse(JSON.stringify(res));
            // console.log(resData);
            // console.log(resData[0].username);
            let player = new Player(res[0].socketId, res[0].username);
            while (res) {
                let player2 = new Player(res[1].socketId, res[1].username);
                players.push(player);
                players.push(player2);
                // console.log(players);
                // console.log(player);
                // const playerSelect = {res, }
                if (players.length > 1) {
                    game = CreateGame(players);
                } else {
                    break;
                }
            } 
        });
    } catch (error) {
        
    } 
};

function CreateGame(players) {
    let game = new Game(generategameId(), players[0], players[1]);
    reqStatutGame = `UPDATE user SET inGame = 1 WHERE socketId = ?`;
    reqCreateGame = `INSERT INTO game (id, player1, player2) VALUES ("${game.idGame}", "${game.player1.id}", "${game.player2.id}")`;
    db.query(reqStatutGame, [players[0].id, players[1].id], function (err, res) {
        if (err) throw err;
    });
    db.query(reqCreateGame, function (err, res) {
        if (err) throw err;
    });
};

function generategameId() {
    return Math.random().toString(36).substring(2, 9);
};

io.on('connection', (socket) => {
    socket.on('goInQueue', (player) => {
        createAccount(player.username, player.socketId, player.inGame, player.enterAt);
        checkPLayerIsSchearching();
    })
    // socket.on('inQueue', (player) => {
    //     createAccount(player.username);
    //     var sqlReq = `UPDATE user SET inQueue = ? WHERE username = ?`;
    //     var sqlReqDate = `UPDATE user SET enterAt = ? WHERE username = ?`;
    //     var sqlReqSocketID = `UPDATE user SET socketID = ? WHERE username = ?`;
    //     db.query(sqlReq, [player.inQueue, player.username], function (err, res) {
    //         if (err) throw err;
    //     });
    //     db.query(sqlReqDate, [player.enterAt, player.username], function (err, res) {
    //         if (err) throw err;
    //     });
    //     db.query(sqlReqSocketID, [player.socketId, player.username], function (err, res) {
    //         if (err) throw err;
    //     })
    //     console.log(`${player.username} est entré dans la file`);
    //     games.playerId1.push(player);
    //     games.playerUsername = [];
    //     var sql = `SELECT username, socketID FROM user WHERE inQueue = ("1") ORDER BY enterAt LIMIT 2`;
    //     db.query(sql, function (err, res) {
    //         if (err) throw err;
    //         Object.keys(res).forEach(function (key) {
    //             playerInQueueArray = res[key];
    //             // console.log(playerInQueueArray);
    //             const id = generategameId(); 
    //             game.set(id, [playerInQueueArray['socketID']]);
    //             // games.playerId1.push(playerInQueueArray['username']);
    //             games.playerUsername.push(playerInQueueArray['username']);
    //             games.socketIdPlayer.push(playerInQueueArray['socketID']);
    //             // console.log(games.playerUsername);
    //             // console.log(games.playerId1);
    //             // console.log(games.socketIdPlayer);
    //             // console.log(playerInQueueArray['username']);
    //             // console.log(playerInQueueArray['socketID']);
    //             // 
    //         });
    //         // socket.to(games.socketIdPlayer).emit('foundGame', games);

    //         //Boucle pour envoyer les sockets aux deux joueurs

    //     });
    //     console.log(game);
    //     for( var i = 0; i <= games.socketIdPlayer.length; i++ ){
    //         socket.to(games.socketIdPlayer[i]).emit('foundGame', games);
    //     };
    //     // io.to(games.socketIdPlayer).emit('foundGame', games);
    //     // io.to(playerInQueueArray['socketID']).emit('foundGame', games); 
});
