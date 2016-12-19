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
var room = {};
var roomSize = 2;

io.on('connection', function (socket) {
    onlineUsers++;

    waitRoom.push(socket);
    if (waitRoom.length == roomSize) {
        var f = parseInt(10000 * Math.random()).toString();
        var wr = {};
        for (var i = 0; i < waitRoom.length; i++) {
            wr[i] = waitRoom[i];
        }
        waitRoom.splice(0, waitRoom.length);

        for(var s in wr){
            wr[s].emit('j',{flag:f,num:s});
        }
        room[f] = wr;
    }
    console.log('有新用户加入在线用户:' + onlineUsers + "房间数:" + getJsonSize(room));

    socket.on('message', function (obj) {
        for (var i in room[obj.flag]) {
            room[obj.flag][i].emit('message', obj);
        }
    });

    socket.on('leave', function (obj) {
        onlineUsers--;
        if (obj.flag != undefined) {
            for (var i in room[obj.flag]) {
                room[obj.flag][i].emit('leave', obj);
            }
            delete room[obj.flag][obj.num];
            if(getJsonSize(room[obj.flag]) == 0){
                delete room[obj.flag];
            }
        }else{
            removeByValue(waitRoom,socket);
        }
        console.log('有玩家离开，当前在线玩家:' + onlineUsers + "房间数量:" + getJsonSize(room));
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
    for(var o in obj){
        i++;
    }
    return i;
}


server.listen(3000, function () {
    console.log('listening on *:3000');
});