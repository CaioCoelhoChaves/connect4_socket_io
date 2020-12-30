const Game = require("./game/game.js");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var rooms = [];
var games = [];

io.on("connection", (socket) => {

    console.log("Novo conectado: " + socket.id);
    io.sockets.emit('rooms', JSON.stringify(rooms));

    //Create a new room
    socket.on('createRoom', (data) =>{
        if(!rooms.includes(data)){
            rooms.push(data);
            socket.join(data);
            games.push(new Game(data, socket.id, io));
            io.sockets.emit('rooms', JSON.stringify(rooms));
            socket.emit('connected', 'conectado a sala!');
        } else{
            io.sockets.emit('error', 'Já existe uma sala com esse nome');
        }
    })

    //Join in a existent room
    socket.on('join', (data) =>{
        socket.emit('connected', 'conectado a sala!');
        socket.join(data);
        games[rooms.indexOf(data)].addPlayer(socket.id, socket);
    });

    socket.on('newPlay', (data) => {
        games[rooms.indexOf(data.room)].newPlay(socket.id, data.column, socket);
    });


    
});

http.listen(3000, () => {
    console.log("Connect 4 API is Running!");
});