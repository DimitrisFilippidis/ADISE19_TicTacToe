const express = require ('express');
const socketio = require('socket.io');

//SETUP++++++
var app = express();
var server = require('http').Server(app);


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
} );

app.use('/assets', express.static(__dirname + '/assets'));

var port = 3000;

server.listen(port);
console.log("Server Running!");

var io = require('socket.io') (server, {});
//SETUP------

//GLOBALS++
var SOCKET_LIST = {};

//GLOBALS--

//CONNECTED
io.sockets.on('connection', function(socket){//SOCKETS++++++
    SOCKET_LIST[socket.id] = socket;
    
    //socket.on('loginRequest', function(credentials){
        //socket.emit('login user');
    //});

});