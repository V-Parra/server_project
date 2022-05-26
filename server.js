const { Socket } = require('socket.io');
const express = require('express');
const { createPopper } = require('@popperjs/core');
const server = express();
const http = require('http').createServer(server);
const port = 8080;
const path = require('path');
const io = require('socket.io')(http);

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})