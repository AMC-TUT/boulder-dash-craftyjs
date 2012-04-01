var loadingText = function() {
    var $loadingText = $('#cr-stage > div > div');
    var newText = $loadingText.text() + '.';
    $loadingText.text(newText.replace(/Ladataan\.{4}/, 'Ladataan'));
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
        "font-size": "2em",
        "padding": "2em",
        "white-space": "nowrap",
        "text-align": "center",
    }).text("Ladataan...");

    // effing ugly text changing
    setInterval("loadingText()", 800);

    Crafty.load(assests,
    function() {
        // loading interval
        clearInterval();

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

});
