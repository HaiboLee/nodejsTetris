var playState = function (game) {
    var flag, num, players = {}, gameover = true, score = 0;
    var d = 10, r = 100;
    var drawMap, chick, createBox;
    var tileMap, layer1;
    var stats, cursors;
    var chickLine = null;
    var socket;
    var sstGroup = [];
    var myx;
    var inputText;
    this.init = function () {
        createBox = new CreateBox();

        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    this.create = function () {
        var sStyle = {font: "15px '微软雅黑'", fill: "#fff", align: "center"};
        game.stage.disableVisibilityChange = true;
        game.add.plugin(Fabrique.Plugins.InputField);
        socket = io.connect('http://localhost:3000', {'reconnection': false});
        socket.emit('getdata'),
            cursors = this.input.keyboard.createCursorKeys();
        tileMap = game.add.tilemap();
        tileMap.addTilesetImage('tileset', 'tile', d, d);
        layer1 = tileMap
            .create('leave1', game.width / d, game.height / d, d, d);
        layer1.scrollFactorX = 0.5;
        layer1.scrollFactorY = 0.5;
        layer1.resizeWorld();

        drawMap = new DrawMap(tileMap, layer1, d, r);
        chick = new Chick(tileMap, layer1, d, r);
        drawMap.drawGrid();
        drawMap.drawBound(3);

        //tileMap.putTile(4, 50, 30, layer1);
        tileMap.fill(0, 10, 49, 77, 1, layer1);
        // 玩家头像位置
        var dd = (game.width - 2 * r) / 5;

        var begindd = r + dd / 2;
        createBox.createUser('one', begindd, r / 4);
        createBox.createUser('two', begindd + dd, r / 4);
        createBox.createUser('three', begindd + 2 * dd, r / 4);
        createBox.createUser('four', begindd + 3 * dd, r / 4);
        createBox.createUser('five', begindd + 4 * dd, r / 4);

        sstGroup.push(createBox.createText('', begindd, r / 3 * 2, sStyle));
        sstGroup.push(createBox.createText('', begindd + dd, r / 3 * 2, sStyle));
        sstGroup.push(createBox.createText('', begindd + 2 * dd, r / 3 * 2, sStyle));
        sstGroup.push(createBox.createText('', begindd + 3 * dd, r / 3 * 2, sStyle));
        sstGroup.push(createBox.createText('', begindd + 4 * dd, r / 3 * 2, sStyle));

        var scoreStyle = {font: "15px '微软雅黑'", fill: "#ccc", align: "center"};
        var scoreText = game.add.text(game.width - 20, 0, '得分:' + score, scoreStyle);
        scoreText.setShadow(1, 1, "#00FFFF", 0);
        scoreText.addColor("#00fffff", 1);
        scoreText.addColor("#000000", 6);
        scoreText.addColor("#00FF00", 7);
        scoreText.anchor.set(0.5);
        scoreText.rotation = 50;
        scoreText.lineSpacing = 1;
        scoreText.anchor.setTo(1, 0);

        inputText = game.add.inputField(game.width / 3, game.height - r / 2, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 300,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Enter发射',
            type: Fabrique.InputType.text
        });
        inputText.anchor.setTo(0, 0)

        // 键盘监听
        document.onkeydown = function (event) {
            if (!gameover) {
                var e = event || window.event
                    || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 38) { // 按 up
                    socket.emit('msg', {type: 5, flag: flag, num: num});
                }
                if (e && e.keyCode == 40) { // 按 down
                    if (chick.chickMove(players[num], 40)) {
                        socket.emit('msg', {
                            type: 1,
                            flag: flag,
                            num: num,
                            x: players[num].x,
                            y: players[num].y + d
                        });
                    }
                }
                if (e && e.keyCode == 37) { // 按 left
                    if (chick.chickMove(players[num], 37)) {
                        socket.emit('msg', {
                            type: 1,
                            flag: flag,
                            num: num,
                            x: players[num].x - d,
                            y: players[num].y
                        });
                    }
                }

                if (e && e.keyCode == 39) { // 按 right
                    if (chick.chickMove(players[num], 39)) {
                        socket.emit('msg', {
                            type: 1,
                            flag: flag,
                            num: num,
                            x: players[num].x + d,
                            y: players[num].y
                        });
                    }
                }
                if (e && e.keyCode == 13) {//发射弹幕
                    //var mm = barrage.value;
                    var mm = inputText.value;
                    console.log(mm)
                    if (mm != '') {
                        socket.emit('barrage', {flag: flag, msg: mm, myx: myx});
                    }
                    inputText.setText('');
                }
            }
        }

        window.onbeforeunload = function () {//关闭窗口
            //leave();
        }

        game.input.onDown.add(function () {
            //gameover = false;
            //socket.emit('restart',{flag:flag,num:num});
            //game.state.start('menu');
            //location.reload(true);
            //scoreText.setText('得分:00');
        });


        socket.on('barrage', function (obj) {//聊天
            sstGroup[obj.myx].text = obj.msg;
            tweeenStart(obj.myx);
        });

        var tween_0 = game.add.tween(sstGroup[0]).to({alpha: 0}, 200, null, false, 0, 8, true);
        var tween_1 = game.add.tween(sstGroup[1]).to({alpha: 0}, 200, null, false, 0, 8, true);
        var tween_2 = game.add.tween(sstGroup[2]).to({alpha: 0}, 200, null, false, 0, 8, true);
        var tween_3 = game.add.tween(sstGroup[3]).to({alpha: 0}, 200, null, false, 0, 8, true);
        var tween_4 = game.add.tween(sstGroup[4]).to({alpha: 0}, 200, null, false, 0, 8, true);

        function tweeenStart(n) {
            switch (n) {
                case 0:
                    tween_0.start().onComplete.add(function () {
                        sstGroup[0].text = '';
                    });
                    break;
                case 1:
                    tween_1.start().onComplete.add(function () {
                        sstGroup[1].text = '';
                    });
                    break;
                case 2:
                    tween_2.start().onComplete.add(function () {
                        sstGroup[2].text = '';
                    });
                    break;
                case 3:
                    tween_3.start().onComplete.add(function () {
                        sstGroup[4].text = '';
                    });
                    break;
                case 4:
                    tween_4.start().onComplete.add(function () {
                        sstGroup[4].text = '';
                    });
                    break;
            }
        }

        var historyMax = createBox.createText('历史最高:\n0', game.width - r + d, r, sStyle)
        var roomOne = createBox.createText('第一名:\n0', game.width - r + d, r + 100, sStyle);
        var roomTwo = createBox.createText('第二名: \n0', game.width - r + d, r + 200, sStyle);
        roomOne.anchor.setTo(0, 0);
        roomTwo.anchor.setTo(0, 0);
        historyMax.anchor.setTo(0, 0);
        historyMax.rotation = 50;
        roomOne.rotation = 50;
        roomTwo.rotation = 50;


        socket.on('getdata', function (obj) {
            historyMax.text = '历史最高:\n' + obj.hismax;
                roomOne.text = '第一名:\n' + obj.maxS[0];
                roomTwo.text = '第二名: \n' + obj.maxS[1];
        })

        socket.on('max', function (obj) {
            historyMax.text = '历史最高:\n' + obj.hismax;
        })

        socket.on('updateRoomScore', function (obj) {
            console.log(obj);
            roomOne.text = '第一名:\n' + obj.maxS[0];
            roomTwo.text = '第二名: \n' + obj.maxS[1];
        });

        socket.on('j', function (obj) { //房间创建完毕 玩家加载完毕
            gameover = false;
            flag = obj.flag;
            num = obj.num;
            console.log(obj.flag);
            console.log(obj.num);
            myx = obj.myx;
            socket.emit('new', {flag: flag, num: num, bid: Math.floor(Math.random() * 4)});
            game.time.events.loop(500, function () {
                if (chick.chickMove(players[num], 40)) {
                    socket.emit('msg', {type: 1, flag: flag, num: num, x: players[num].x, y: players[num].y + 10});
                } else {
                    socket.emit('msg', {type: 2, flag: flag, num: num});
                    socket.emit('msg', {type: 3, flag: flag, num: num});
                    socket.emit('new', {flag: flag, num: num, bid: Math.floor(Math.random() * 4)});
                }
            });

            game.time.events.start();
        });

        socket.on('new', function (obj) {
            players[obj.num] = createBox.createMyBox(obj.bid, begindd + obj.x * dd, r);
        });

        socket.on('score', function (obj) {
            scoreText.setText('得分:' + obj.score);
        })

        socket.on('msg', function (obj) {
            switch (obj.type) {
                case 1://方块位置变化
                    players[obj.num].x = obj.x;
                    players[obj.num].y = obj.y;
                    break;
                case 5://旋转
                    chick.chickAngle(players[obj.num]);
                    break;
                case 0://产生新方块
                    players[obj.num] = createBox.createMyBox(obj.bid, begindd + obj.num * dd, r);
                    break;
                case 2://方块停止运动绘制瓦片 并检查是否得分
                    drawMap.drawBox(players[obj.num]);
                    if (obj.num == num) {
                        chickLine = chick.chickLine(players[num]);
                        if (chickLine.length != 0) {
                            socket.emit('msg', {type: 4, flag: flag, line: chickLine});
                            chickLine.splice(0, chickLine.length);
                        }
                        if (chick.chickDie()) {
                            socket.emit('msg', {type: 7, flag: flag});
                        }
                    }
                    break;
                case 3://销毁方块
                    players[obj.num].destroy();
                    break;
                case 4://得分 消除整行并下移
                    drawMap.removeLine(obj.line);
                    drawMap.downTile(obj.line);
                    socket.emit('score', {'flag': flag, 'goal': obj.line.length});
                    break;
                case 6://用户离开
                    removeByValue(players, players[obj.num]);
                    players[obj.num].destroy();
                    break;
                case 7://游戏结束
                    gameover = true;
                    game.time.events.stop(false);
                    var style = {font: "50px '微软雅黑'", fill: "#ccc", align: "center"};
                    var text = game.add.text(game.width / 2, game.height, 'GAME  OVER!', style);
                    text.setShadow(1, 1, "#00FFFF", 0);
                    text.addColor("#00fffff", 1);
                    text.addColor("#000000", 6);
                    text.addColor("#00FF00", 7);
                    text.anchor.set(0.5);
                    text.rotation = 50;
                    text.lineSpacing = 1;
                    game.add.tween(text).to({y: game.height / 2}, 2000, Phaser.Easing.Elastic.Out, true, 0, 0, false);
                    var restart_btn = game.add.button(game.width / 2, game.height / 2 + 50, 'start_btn', function () {
                        //gameover = false;
                        //socket.emit('restart',{flag:flag,num:num});
                        //game.state.start("menu");
                        location.reload(true);
                    });
                    restart_btn.scale.setTo(0.5);
                    restart_btn.anchor.setTo(0.5);

                    break;

            }
        });
    }
    this.update = function () {
        stats.update();
    }

    function removeByValue(array, val) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) {
                array.splice(i, 1);
                break;
            }
        }
    }

}