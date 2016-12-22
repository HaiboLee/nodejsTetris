class CreateBox {

    createMyBox(a, x, y) {
        var box;
        switch (a) {
            case 0:
                box = game.add.sprite(x, y, 'l');
                box.anchor.setTo(0.5, 1 / 3);
                return box;
            case 1:
                box = game.add.sprite(x, y, 'o');
                box.anchor.setTo(0.5, 0.5);
                return box;
            case 2:
                box = game.add.sprite(x, y, 'i');
                box.anchor.setTo(0, 0.5);
                return box;
            case 3:
                box = game.add.sprite(x, y, 't');
                box.anchor.setTo(1 / 3, 0.5);
                return box;
            case 4:
                box = game.add.sprite(x, y, 'lf');
                box.anchor.setTo(0.5,1/3);
                return box;

            case 5:
                box = game.add.sprite(x, y, 'x');
                box.anchor.setTo(0.5,1/3);
                return box;

            case 6:
                box = game.add.sprite(x, y, 'xf');
                box.anchor.setTo(0.5,1/3);
                return box;
        }
    }

    createUser(a, x, y) {
        game.add.image(x, y, a).anchor.setTo(0.5, 0.5);
    }

    createText(a, x, y, s) {
        var text = game.add.text(x, y, a, s);
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