var loadingText = function() {
    var $loadingText = $('#cr-stage > div > div');
    var newText = $loadingText.text() + '.';
    $loadingText.text(newText.replace(/Loading\.{4}/, 'Loading'));
}

//Loading Scene
Crafty.scene("Loading",
function() {

    var assests = [
    //Images & Sounds
    game.path + "/assets/img/sprite.png",
    ];

    Crafty.background("#000");

    Crafty.e("2D", "DOM", "Text").css({
        "font-size": "170%",
        "white-space": "nowrap",
        "text-align": "center",
    })
    .attr({ x: 100, y: 100 })
    .text("Loading...");

    // effing ugly text changing
    var interval = setInterval("loadingText()", 800);

    Crafty.load(assests,
    function() {
        // loading interval
        clearInterval(interval);

        // go to game
        Game.reset();

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

//Game Over Scene
Crafty.scene("GameOver",
function() {

    Crafty.background("#000");

    Crafty.e("2D, DOM, Image")
    .attr({ x: 50, y: 40, w: 336, h: 240 })
    .image(game.path + "/assets/img/logo.png");

    Crafty.e("2D", "DOM", "Text").css({
        "font-size": "170%",
        "white-space": "nowrap",
        "text-align": "center",
        "color": "#A36E30",
        "line-height": "2em"
    })
    .attr({ x: 440, y: 110 })
    .text("Game Over");

    Crafty.e("2D", "DOM", "Text", "game-start").css({
        "font-size": "170%",
        "white-space": "nowrap",
        "text-align": "center",
        "cursor": "pointer",
        "line-height": "2em"
    })
    .attr({ x: 440, y: 150 })
    .text("Start New Game");

});

//Game Over Scene
Crafty.scene("GameFinish",
function() {

    Crafty.background("#000");

    Crafty.e("2D, DOM, Image")
    .attr({ x: 50, y: 40, w: 336, h: 240 })
    .image(game.path + "/assets/img/logo.png");

    Crafty.e("2D", "DOM", "Text").css({
        "font-size": "170%",
        "white-space": "nowrap",
        "text-align": "center",
        "color": "#A36E30",
        "line-height": "2em"
    })
    .attr({ x: 440, y: 90 })
    .text("Game Finish");

    Crafty.e("2D", "DOM", "Text").css({
        "font-size": "170%",
        "white-space": "nowrap",
        "text-align": "center",
        "color": "green",
        "line-height": "2em"
    })
    .attr({ x: 440, y: 130 })
    .text("Your Score: " + Game.score );

    Crafty.e("2D", "DOM", "Text", "game-start").css({
        "font-size": "170%",
        "white-space": "nowrap",
        "text-align": "center",
        "cursor": "pointer",
        "line-height": "2em"
    })
    .attr({ x: 440, y: 170 })
    .text("Start New Game");

});

//Game Scene
Crafty.scene("Game",
function() {

    Crafty.background("#000");

    var world = [
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
                            x:
                            j * game.cellsize,
                            y: i * game.cellsize,
                            z: 2
                        });
                        break;
                    case 2:
                        Crafty.e('Stone').attr({
                            x:
                            j * game.cellsize,
                            y: i * game.cellsize,
                            z: 2
                        });
                        break;
                    case 3:
                        Crafty.e('Diamond').attr({
                            x:
                            j * game.cellsize,
                            y: i * game.cellsize,
                            z: 2
                        })
                        break;
                    case 4:
                        Crafty.e('Brick').attr({
                            x:
                            j * game.cellsize,
                            y: i * game.cellsize,
                            z: 2
                        })
                        break;
                    case 5:
                        // empty space
                        break;
                    case 8:
                        Crafty.e('Door').attr({
                            x:
                            j * game.cellsize,
                            y: i * game.cellsize,
                            z: 2
                        })
                        break;
                    default:
                        Crafty.e('Steel').attr({
                            x:
                            j * game.cellsize,
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

    $(window).trigger('resize');

});
