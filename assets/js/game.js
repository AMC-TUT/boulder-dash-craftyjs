/* Author: AMC

*/

window.onload = function() {

    "use strict";

    var WIDTH = 1280,
    HEIGHT = 736;

    // Initialize Crafty
    Crafty.init(WIDTH, HEIGHT);

    Crafty.background("#FFF");

    Crafty.scene("Loading");

};


!function( $ ){

    $(".game-start").bind('click', function(event) {
        //
        Game.reset();
    });

}( window.jQuery );
