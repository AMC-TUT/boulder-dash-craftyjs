

//Loading Scene
Crafty.scene("Loading",
function() {
    /*
    var assests = [
    //Images
    game.path + "/assets/img/bg.png",
    game.path + "/assets/img/ships.png",
    game.path + "/assets/img/weapon1_small.png",
    game.path + "/assets/img/weapon2.png",
    game.path + "/assets/img/dmg.png",
    game.path + "/assets/img/asteroid64.png",
    game.path + "/assets/img/asteroidgame.cellsize.png",
    game.path + "/assets/img/explosion.png",
    game.path + "/media/sounds/explode.mp3",
    game.path + "/media/sounds/explode.ogg",
    game.path + "/media/sounds/explode.wav",
    ];
    */

    Crafty.background("#000");

    Crafty.e("2D", "DOM", "Text").css({
        "font-size": "2em",
        "padding": "2em",
        "white-space": "nowrap",
        "text-align": "center"
        }).text("Ladataan...");

        Crafty.load([game.path + "/assets/img/sprite.png"],
        function() {
            //when loaded
            Crafty.audio.play("uncover");
            // go to Game scene
            Crafty.scene("Game");
        },
        function(e) {
            //progress
            //log('loaded ' + e.loaded + ', percent ' + Math.round(e.percent) + ', total ' + e.total);
        },
        function(e) {
            //uh oh, error loading
            alert('Error while loading assets (loaded ' + e.loaded + ', percent ' + Math.round(e.percent) + ', total ' + e.total + ')');
        }
    );

});

//Game Scene
Crafty.scene("Game",
function() {

    //Crafty.HashMap(game.cellsize);

    Crafty.background("#000");

    var world = [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 5, 1, 1, 3, 1, 2, 5, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0],
    [0, 1, 2, 8, 2, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 2, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 5, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 5, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0],
    [0, 2, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0],
    [0, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 5, 1, 0],
    [0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 2, 1, 1, 2, 1, 0],
    [0, 1, 5, 1, 1, 1, 2, 1, 1, 3, 1, 5, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 2, 5, 1, 1, 1, 1, 1, 1, 2, 1, 0],
    [0, 1, 1, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5, 5, 2, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 0],
    [0, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 5, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 1, 1, 5, 1, 0],
    [0, 1, 2, 1, 1, 5, 1, 1, 2, 1, 5, 5, 1, 1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1, 2, 1, 0],
    [0, 1, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 5, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 5, 5, 1, 1, 1, 1, 3, 1, 1, 1, 2, 1, 2, 2, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 2, 3, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0],
    [0, 1, 1, 1, 5, 1, 1, 5, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 0],
    [0, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // if world is array
    if (_.isArray(world)) {
        //
        var i = 0,
        type = "",
        extras = "";
        //  row
        // loop each row
        _.each(world,
            function(row) {
                // row is array
                if (_.isArray(row)) {
                    //
                    var j = 0;
                    // column
                    // loop each cell
                    _.each(row,
                        function(cell) {
                            switch (cell) {
                                case 1:
                                Crafty.e('Dirt').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                });
                                break;
                                case 2:
                                Crafty.e('Stone').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                });
                                break;
                                case 3:
                                Crafty.e('Diamond').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                })
                                break;
                                case 4:
                                Crafty.e('Brick').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                })
                                break;
                                case 5:
                                // empty space
                                break;
                                case 8:
                                Crafty.e('Door').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                })
                                break;
                                case 9:
                                Crafty.e('Finish').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                })
                                break;
                                default:
                                Crafty.e('Steel').attr({
                                    x: j * game.cellsize,
                                    y: i * game.cellsize,
                                    z: 2
                                })
                            }
                            // column
                            j++;
                        });
                    }
                    // row
                    i++;
                });
            }

        });
