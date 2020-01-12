const express = require ('express');
const socketio = require('socket.io');
const mysql = require('mysql');

//SETUP++++++
var app = express();
var server = require('http').Server(app);


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
} );

app.use('/assets', express.static(__dirname + '/assets'));

var port = 3000;

server.listen(port);
console.log("---SERVER RUNNING---");

var io = require('socket.io') (server, {});
//SETUP------

//CONNECT MYSQL
const db = mysql.createConnection({
    server      : 'users.iee.ihu.gr',
    user        : 'root',
    password    : 'dbpass',
    database    : 'tttdb',
    _socket: '/home/student/it/2017/it174982/mysql/run/mysql.sock'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("---MYSQL CONNECTED---");
});

//GLOBALS++
var SOCKET_LIST = {};
var players = 0;

//GLOBALS--

//SOCKET CONNECTED
io.sockets.on('connection', function(socket){//SOCKETS++++++
    SOCKET_LIST[socket.id] = socket;
    
    socket.on("login", function(username){
        if(players < 2){
            players++;
        }
    });

    db.connect(function(err) {
        if (err) throw err;
        db.query("SELECT * FROM players", function (err, results){   //, fields) {
            if (err) throw err;
            console.log(results);
        });
      });

});