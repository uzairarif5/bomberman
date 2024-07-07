var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use(express.static('staticFolder'));
app.use('/favicon.ico', express.static('staticFolder/favicon.ico'));

app.get('/bomberman', function (req, res) {
	res.sendFile(__dirname + '/bomberman.html');
})

var player = 0;
var nodeMaxPlayers;
var canvasArray;
var gameStart = false;
io.sockets.on('connection', (socket) => {
	player += 1;
	if(player == 1){
		nodeMaxPlayers = -1;
		socket.send({msgFor:'start'});
	}
	else{
		socket.send({msgFor:'others',Pnum:player});
		io.sockets.emit('getMax', nodeMaxPlayers);
		io.sockets.emit('getCanvas', canvasArray);
		io.sockets.emit('getnum', player);
	}
	socket.on('disconnect', () => {
		player -= 1;
		if(player == 0){
			gameStart = false;
		}
		else{
			if(player<nodeMaxPlayers){
				io.sockets.emit('connectError');
			}
		}
	});
	socket.on('setMax', (msg)=>{
		nodeMaxPlayers = msg;
		io.sockets.emit('getMax', msg);
		io.sockets.emit('getnum', player);
	});
	socket.on('newMes', (msg)=>{
		io.sockets.emit('putMsg', msg);
	});
	socket.on('giveCanvas', (msg)=>{
		canvasArray = msg;
	});
	socket.on('startGame', ()=>{
		if(!gameStart){
			gameStart = true;
			io.sockets.emit('removeWaiting',true);
		}
		else{
			io.sockets.emit('removeWaiting',false);
		}
	});
	socket.on('keyPress', (msg)=>{
		io.sockets.emit('giveKeyPress', msg);
	});
	socket.on('announce winner', (msg)=>{
		io.sockets.emit('showWinner', msg);
	});
});

http.listen(8080);
