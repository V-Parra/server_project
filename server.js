const { Socket } = require('socket.io');
const express = require('express');
const { createPopper } = require('@popperjs/core');
const server = express();
const http = require('http').createServer(server);
const port = 8080;
const path = require('path');
const { append } = require('express/lib/response');
const { db } = require('./database');
const io = require('socket.io')(http);

server.use('/bootstrap/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
server.use('/bootstrap/js', express.static(path.join(__dirname, '/node_modules/bootstrap/disc/js')));
server.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
server.use(express.static('public'));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

server.post('/', (req, res) => {
    var username = req.body.username;

    var sql = `INSERT INTO user (username) VALUES ("${username})`;
    db.query(sql, function(err, res) {
        if (err) throw err;
        console.log('Success');
        req.flash('success', 'Data added succesfully');
    });
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

