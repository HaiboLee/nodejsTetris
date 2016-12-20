class CreateBox {

    createMyBox(a, x, y) {
        var box;
        if (a == 0) {
            box = game.add.sprite(x, y, 'l');
            box.anchor.setTo(0.5, 1 / 3);
        } else if (a == 1) {
            box = game.add.sprite(x, y, 'o');
            box.anchor.setTo(0.5, 0.5);
        } else if (a == 2) {
            box = game.add.sprite(x, y, 'i');
            box.anchor.setTo(0, 0.5);
        } else if (a == 3) {
            box = game.add.sprite(x, y, 't');
            box.anchor.setTo(1 / 3, 0.5);
        }
        return box;
    }

    createUser(a, x, y) {
        game.add.image(x, y, a).anchor.setTo(0.5, 0.5);
    }

    createText(x, y, s) {
        var text = game.add.text(x, y, '', s);
        text.setShadow(1, 1, "#00FFFF", 0);
        //text.addColor("#ff0000", 1);
        //text.addColor("#0000ff", 6);
        //text.addColor("#00FF00", 7);
        text.anchor.set(0.5);
       // text.rotation = 50;
        text.lineSpacing = 1;
        return text;
    }
}