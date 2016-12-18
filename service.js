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

io.on('connection', function (socket) {
    onlineUsers++;
    console.log('有用户加入在线用户:' + onlineUsers);
    waitRoom.push(socket);
    if (waitRoom.length == 5) {
        var f = parseInt(10000 * Math.random()).toString();
        var wr = [];
        for (var i = 0; i < waitRoom.length; i++) {
            wr.push(waitRoom[i]);
        }
        waitRoom.splice(0,waitRoom.length);
        for(var i = 0;i<wr.length;i++){
            wr[i].emit('j',{flag:f,num:i});
        }
        room[f] = wr;

    }

    socket.on('message', function (obj) {
        for(var i in room[obj.flag]){
            room[obj.flag][i].emit('message',obj);
        }
    });

    socket.on('leave', function (obj) {
        onlineUsers--;
        console.log('有玩家离开，当前在线玩家:'+ onlineUsers);
        for(var i in room[obj.flag]){
            room[obj.flag][i].emit('leave',obj);
        }
        removeByValue(room[obj.flag],obj.num);
    })


});

function removeByValue(array, val) {
    for(var i=0; i<array.length; i++) {
        if(array[i] == val) {
            array.splice(i, 1);
            break;
        }
    }
}


server.listen(3000, function () {
    console.log('listening on *:3000');
});