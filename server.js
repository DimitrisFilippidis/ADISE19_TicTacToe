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

/*db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();                        // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });

  
  function handleDisconnect(){
            db.connect((err) => {
                if(err){
                    setInterval(handleDisconnect, 2000);
                    throw err;
                }
                console.log("---MYSQL CONNECTED---");
            });
    }
  
*/

setInterval(function () {
    db.query('SELECT 1');
}, 5000);

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
var turn = 'X';

//GLOBALS--

    db.query("SELECT * FROM players", function (err, results){   //, fields) {
        if (err) throw err;
        console.log(results);
    });

//SOCKET CONNECTED
io.sockets.on('connection', function(socket){//SOCKETS++++++
    SOCKET_LIST[socket.id] = socket;
    
    socket.on("login", function(data){
        if(players < 2){
            players++;
            var symbol;
            if(players == 1)
                symbol = 'X';
            else
                symbol = 'O';
            socket.emit("setSymbol",{symbol});
            //player_accounts[players].id = playerIDs;
            player_accounts[players-1].username = data.uname;
            //player_accounts[players].score = getScore();
            //playerIDs++;

            if(players == 2){
                var unames = player_accounts[0].username+"-VS-"+player_accounts[1].username;
                io.broadcast("displayUsernames", {unames});
            }
        }
        else{
            socket.emit("reload");
        }
    });


    //socket.on("test", function(){
       // socket.emit("test_response");
   // });

    socket.on("input", function(data){
        var i = data.arr[0];
        var j = data.arr[1];
        var input = data.playerSymbol;

        if(input == turn){
            board[i][j] = input;
            socket.broadcast.emit('oppInput', data);
            checkWin();

            if(turn == 'X')
                turn = 'O';
            else
                turn = 'X';
        }
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
        io.emit("win", {winner});
        players = 0;
        board = [
            ['','',''],
            ['','',''],
            ['','','']
        ];
        player_accounts = [{id: 0, username: "", score: 0}, {id: 0, username: "", score: 0}];
    }
        
}