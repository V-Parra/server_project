const { Socket } = require('socket.io');
const express = require('express');
const { createPopper } = require('@popperjs/core');
const server = express();
const http = require('http').createServer(server);
const port = 8080;
const path = require('path');
const { append } = require('express/lib/response');
const { db, selectQuery, createAccount } = require('./database');
const io = require('socket.io')(http);
const body = require('body-parser');

server.use('/bootstrap/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
server.use('/bootstrap/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
server.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
server.use(express.static('public'));
server.use(body.urlencoded({
    extended: true
}))
server.use(body.json());

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

server.post('/test', (req, res) => {
    var usernamedata = req.body;
    createAccount(usernamedata.name_field);
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});



io.on('connection', (socket) => {
    console.log(`[connection] ${socket.id}`);
});
