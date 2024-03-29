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

setInterval(function () {
    db.query('SELECT 1');
}, 5000);

//GLOBALS++
var SOCKET_LIST = {};
var players = 0;
var player_accounts = [{username: "", score: 0}, {username: "", score: 0}];
var board = [
    ['','',''],
    ['','',''],
    ['','','']
];
var turn = 'X';

//GLOBALS--

    db.query("SELECT * FROM players", function (err, results){
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
            console.log("players: "+players);
            //if(checkAccExists(data.name)){                
               // player_accounts[players-1].score = getScore(data.uname);
            //}
            /*else{
                db.query("INSERT INTO players (id, username, score) VALUES ("+playerIDs+", '"+data.uname+"', "+0+")", function (err, results){
                    if (err) throw err;
                    console.log(results);
                });
            }*/
                
            player_accounts[players-1].username = data.uname;

            if(players == 2){
                var unames = player_accounts[0].username+":"+player_accounts[0].score+"-VS-"+player_accounts[1].username+":"+player_accounts[1].score;
                io.emit("displayUsernames", {unames});
            }
        }
        else{
            socket.emit("reload");
        }
    });


    socket.on("input", function(data){
        var i = data.arr[0];
        var j = data.arr[1];
        var squareId = data.squareId;
        var input = data.playerSymbol;

        if(input == turn && board[i][j] == ''){
            board[i][j] = input;
            socket.broadcast.emit('oppInput', data);
            socket.emit("inputApproved", {squareId, input});
            checkWin();

            if(turn == 'X')
                turn = 'O';
            else
                turn = 'X';
        }
    });

    socket.on('disconnect', function () {
        io.emit('disconnected');  
        players = 0;
        board = [
            ['','',''],
            ['','',''],
            ['','','']
        ];
    });
});

function checkWin(){
    var winner = "";

    var i = 0;
    var j = 0;
    var notTie = false;
    
     for (i=0; i<=2; i++) {
         for (j=0; j<=2; j++) {
             if(board[i][j] == ""){
                     notTie = true;
             }
        }
     }

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
        if(notTie)
            winner = winner+" won.";
        else
            winner = "TIE";

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

/*function getScore(name){
    var res;
    db.query("SELECT score FROM players WHERE username = '"+name+"'", function (err, results){   //, fields) {
        if (err) throw err;
        console.log(results);
        res = results;
    });
    var score = JSON.stringify(res)).score;
    return score;
}

function checkAccExists(name){
    var res;
    db.query("SELECT username FROM players WHERE username = '"+name+"'", function (err, results){
        if (err) throw err;
        res = results;
        console.log("res: "+JSON.stringify(res));
    });
    if(res.username != ""){
        return true;
    }
    return false;
}*/