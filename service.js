var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.use(express.static('./'));

//在线用户
var onlineUsers = 0;

var waitRoom = [];
var roomSize = 2;
var room = {};

var play_game = io.of('/play_game');

io.on('connection', function (socket) {
    onlineUsers++;
    waitRoom.push(socket);
    if (waitRoom.length == roomSize) {
        var f = parseInt(100000 * Math.random()).toString();
        var wr = {};
        for (var i = 0; i < waitRoom.length; i++) {
            wr[waitRoom[i].id] = i;
            waitRoom[i].emit('j',{flag: f, num: waitRoom[i].id});
            waitRoom[i].join(f);
        }
        wr['score'] = 0;
        waitRoom.splice(0, waitRoom.length);
        room[f] = wr;
    }
    console.log('有新用户加入在线用户:' + onlineUsers + '房间数：' + getJsonSize(room));
    socket.on('msg', function (obj) {
        io.sockets.in(obj.flag).emit('msg',obj);
    });

    socket.on('restart', function () {
        socket.emit('disconnect');
    });

    socket.on('new', function (obj) {
        obj['x'] = room[obj.flag][socket.id];
        io.sockets.in(obj.flag).emit('new',obj);
    });

    socket.on('score', function (obj) {
        io.sockets.in(obj.flag).emit('score',{score : room[obj.flag]['score']+Math.pow(2,obj.goal)});
    })

    socket.on('disconnect', function () {
        onlineUsers--;
        for (var i = 0; i < waitRoom.length; i++) {
            if (socket == waitRoom[i]) {
                waitRoom.splice(i, 1);
                console.log('等候室用户离开:' + onlineUsers);
                return;
            }
        }
        var roomId;
        for (var i in room){
            if(room[i][socket.id]!=undefined){
                roomId = i;
                break;
            }
        }
        //console.log(io.sockets.adapter.rooms);
        //console.log("离开玩家的："+socket.id);
        io.sockets.in(roomId).emit('msg',{type:6,num:socket.id});
        delete room[roomId][socket.id];
        if(getJsonSize(room[roomId]) == 1){
            delete room[roomId];
        }
        //console.log(io.sockets.adapter.rooms);
        console.log('有玩家离开，当前在线玩家:' + onlineUsers + '房间数：' + getJsonSize(room))
    });

    socket.on('reconnect', function(){
        console.log('重連');
    });
});

function removeByValue(array, val) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == val) {
            array.splice(i, 1);
            break;
        }
    }
}

function getJsonSize(obj) {
    var i = 0;
    for (var o in obj) {
        i++;
    }
    return i;
}


server.listen(3000, function () {
    console.log('listening on *:3000');
});