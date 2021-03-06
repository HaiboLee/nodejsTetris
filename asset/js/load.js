var loadState = function (game) {
    this.preload = function () {
        game.load.image('l','asset/img/L.png');
        game.load.image('i','asset/img/I.png');
        game.load.image('o','asset/img/o.png');
        game.load.image('t','asset/img/T.png');
        game.load.image('x','asset/img/x.png');
        game.load.image('xf','asset/img/xf.png');
        game.load.image('lf','asset/img/lf.png');
        game.load.image('tile','asset/img/tile.png');
        game.load.image('one','asset/img/one.png');
        game.load.image('two','asset/img/two.png');
        game.load.image('three','asset/img/three.png');
        game.load.image('four','asset/img/four.png');
        game.load.image('five','asset/img/five.png');
        game.load.image('start_btn','asset/img/start-button.png');
    }
    this.create = function () {
        game.state.start('menu');
    }
}