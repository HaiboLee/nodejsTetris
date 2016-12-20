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
var maxScore = [0, 0];
var historyMaxScore = 0;

var play_game = io.of('/play_game');

io.on('connection', function (socket) {
    onlineUsers++;
    waitRoom.push(socket);
    if (waitRoom.length == roomSize) {
        var f = parseInt(100000 * Math.random()).toString();
        var wr = {};
        for (var i = 0; i < waitRoom.length; i++) {
            wr[waitRoom[i].id] = i;
            waitRoom[i].emit('j', {flag: f, num: waitRoom[i].id, myx: i});
            waitRoom[i].join(f);
        }
        wr['score'] = 0;
        waitRoom.splice(0, waitRoom.length);
        room[f] = wr;
        io.sockets.emit('updateRoomScore', {'maxS': maxScore});
    }
    console.log('有新用户加入在线用户:' + onlineUsers + '房间数：' + getJsonSize(room));
    socket.on('msg', function (obj) {
        io.sockets.in(obj.flag).emit('msg', obj);
    });

    socket.on('getdata', function () {
        socket.emit('getdata', {'hismax': historyMaxScore, 'maxS': maxScore});
    });

    /*    socket.on('restart', function () {
     socket.emit('disconnect');
     });*/

    socket.on('barrage', function (obj) {
        io.sockets.in(obj.flag).emit('barrage', obj);
    });

    socket.on('new', function (obj) {
        obj['x'] = room[obj.flag][socket.id];
        io.sockets.in(obj.flag).emit('new', obj);
    });

    socket.on('score', function (obj) {
        var newscore = room[obj.flag]['score'] + Math.pow(2, obj.goal);
        io.sockets.in(obj.flag).emit('score', {score: newscore});

        if (newscore > maxScore[0] && newscore > maxScore[1]) {
            if (maxScore[0] == maxScore[1]) {
                maxScore[0] = newscore;
            } else {
                maxScore[1] = maxScore[0];
                maxScore[0] = newscore;
            }
            console.log(maxScore);
            if (newscore > historyMaxScore) {
                historyMaxScore = newscore;
                io.sockets.emit('max', {'hismax': historyMaxScore});
            }
            io.sockets.emit('updateRoomScore', {'hismax': historyMaxScore, 'maxS': maxScore});
        } else if ((!newscore > maxScore[0]) && newscore > maxScore[1]) {
            maxScore[1] = newscore;
            io.sockets.emit('updateRoomScore', {'hismax': historyMaxScore, 'maxS': maxScore});
        }
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
        for (var i in room) {
            if (room[i][socket.id] != undefined) {
                roomId = i;
                break;
            }
        }
        //console.log(io.sockets.adapter.rooms);
        //console.log("离开玩家的："+socket.id);
        io.sockets.in(roomId).emit('msg', {type: 6, num: socket.id});
        delete room[roomId][socket.id];
        if (getJsonSize(room[roomId]) == 1) {
            delete room[roomId];
            if (getJsonSize(room) == 0) {
                maxScore = [0,0];
            }
        }
        //console.log(io.sockets.adapter.rooms);
        console.log('有玩家离开，当前在线玩家:' + onlineUsers + '房间数：' + getJsonSize(room))
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