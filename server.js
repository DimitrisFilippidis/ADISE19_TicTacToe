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

var port = process.env.PORT || 3000;

server.listen(port);
console.log("---SERVER RUNNING---");

var io = require('socket.io') (server, {});
//SETUP------

//CONNECT MYSQL
/*var db = mysql.createConnection({
    server      : 'users.iee.ihu.gr',
    user        : 'root',
    password    : 'dbpass',
    database    : 'tttdb',
    _socket     : '/home/student/it/2017/it174982/mysql/run/mysql.sock'
});*/

var db = mysql.createConnection({
    host        : 'eu-cdbr-west-02.cleardb.net',
    user        : 'b760f6b956efa5',
    password    : '6485311a',
    database    : 'heroku_7c65a958dfb211b'
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
var playerIDs = 3;
var player_accounts = [{id: 0, username: "", score: 0}, {id: 0, username: "", score: 0}];
var board = [
    ['','',''],
    ['','',''],
    ['','','']
];

//GLOBALS--

    /*db.query("SELECT * FROM players", function (err, results){   //, fields) {
        if (err) throw err;
        console.log(results);
    });*/

//SOCKET CONNECTED
io.sockets.on('connection', function(socket){//SOCKETS++++++
    SOCKET_LIST[socket.id] = socket;
    
    socket.on("login", function(username){
        if(players < 2){
            players++;
            player_accounts[players].id = playerIDs;
            player_accounts[players].username = username;
            //player_accounts[players].score = getScore();
            playerIDs++;
        }
    });


    //socket.on("test", function(){
       // socket.emit("test_response");
   // });

    socket.on("input", function(data){
        var i = data.arr[0];
        var j = data.arr[1];
        var input = data.player;

        board[i][j] = input;
        checkWin();
        socket.broadcast.emit('oppInput', data);
    });
});

function checkWin(){
    var winner = "";

    //orizontia
    if( (board[0][0] == board[0][1]) && (board[0][1] == board[0][2]) )
        winner = board[0][0];
        
    else if( (board[1][0] == board[1][1]) && (board[1][1] == board[1][2]) )
        winner = board[1][0];

    else if( (board[2][0] == board[2][1]) && (board[2][1] == board[2][2]) )
        winner = board[2][0];
    //katheta
    else if( (board[0][0] == board[1][0]) && (board[1][0] == board[2][0]) )
        winner = board[0][0];

    else if( (board[0][1] == board[1][1]) && (board[1][1] == board[2][1]) )
        winner = board[0][1];

    else if( (board[0][2] == board[1][2]) && (board[1][2] == board[2][2]) )
        winner = board[0][2];
    //diagwnia
    else if( (board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) )
        winner = board[0][0];

    else if( (board[0][2] == board[1][1]) && (board[1][1] == board[2][0]) )
        winner = board[0][2];
     
    if(winner != ""){
        socket.emit("win", winner);
    }
        
}