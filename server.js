
const { Socket } = require('socket.io');
const express = require('express');
const { createPopper } = require('@popperjs/core');
const server = express();
const http = require('http').createServer(server);
const port = 8080;
const path = require('path');
const { db, checkPlayerInQueue, createAccount, playerInQueueArray } = require('./database');

/**
 * @type {Socket}
 */

const io = require('socket.io')(http);
const body = require('body-parser');
const { threadId } = require('worker_threads');

server.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
server.use('/bootstrap/js/', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
server.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io/dist')));
server.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
server.use(express.static('src'));
server.use(body.urlencoded({
    extended: true
}))
server.use(body.json());

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});


// server.get('/games/morpion', (req, res) => {
//     res.sendFile(path.join(__dirname, '/templates/games/morpion.html'));
// })

// server.post('/', (req, res) => {
//     // var usernamedata = req.body;
//     // createAccount(usernamedata.name_field);
//     // console.log(usernamedata.name_field);
// });

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});


const games = {
    gamesID: "",
    playerId1: "",
    playerId2: "",
};

io.on('connection', function (socket) {
    socket.on('inQueue', (player) => {
        createAccount(player.username);
        var sqlReq = `UPDATE user SET inQueue = ? WHERE username = ?`;
        var sqlReqDate = `UPDATE user SET enterAt = ? WHERE username = ?`;
        var sqlReqSocketID = `UPDATE user SET socketID = ? WHERE username = ?`;
        db.query(sqlReq, [player.inQueue, player.username], function (err, res) {
            if (err) throw err;
        });
        db.query(sqlReqDate, [player.enterAt, player.username], function (err, res) {
            if (err) throw err;
        });
        db.query(sqlReqSocketID, [player.socketId, player.username], function (err, res) {
            if (err) throw err;
        })
        console.log(`${player.username} est entré dans la file`);
        var sql = `SELECT username, socketID FROM user WHERE inQueue = ("1") ORDER BY enterAt LIMIT 2`;
        db.query(sql, function (err, res) {
            if (err) throw err;
            Object.keys(res).forEach(function (key) {
                var playerInQueueArray = res[key];
                games.playerId1 = playerInQueueArray['username'];
                games.playerId2 = playerInQueueArray['username'];
                console.log(games.playerId1);
                // console.log(games.playerId2);
                //socket.to(playerInQueueArray['socketID']).emit('foundGame', games);
            });
        });
    })
});
