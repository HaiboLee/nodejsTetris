var menuState = function (game) {

    this.create = function () {
        var start_btn = game.add.button(game.width/2,game.height/2,'start_btn', function () {
            game.state.start('play');
        });
        start_btn.anchor.setTo(0.5);
    }
}