/**@
* #Fourway
* @category Input
* Move an entity in four directions by using the
* arrow keys or `W`, `A`, `S`, `D`.
*/
Crafty.c("Blockway", {

    init: function() {
        this.requires("Fourway");
    },

    /**@
* #.fourway
* @comp Fourway
* @sign public this .fourway(Number speed)
* @param speed - Amount of pixels to move the entity whilst a key is down
* Constructor to initialize the speed. Component will listen for key events and move the entity appropriately.
* This includes `Up Arrow`, `Right Arrow`, `Down Arrow`, `Left Arrow` as well as `W`, `A`, `S`, `D`.
*
* When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}
* When entity has moved on either x- or y-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
*
* The key presses will move the entity in that direction by the speed passed in the argument.
* @see Multiway
*/
    blockway: function(speed) {
        this.fourway(speed)
        .bind("EnterFrame",
        function(frame) {
            //  this.disableControl();
            //var enable =
            //	  setTimeout("this.enableControl()", 500);
            //if (this.disableControls) return;
            //if (this._up) {
            //	this.y -= jump;
            //	this._falling = true;
            //		this.enableControl();
            });


        return this;
    }
});

function timer() {
/*
    var timeleft = 150;

    setInterval(function() {

        timeleft -= 1;

        if (timeleft == 0) {
            Crafty.e("Player").die();
        }

        var s = timeleft.toString();
        var a = s.split("");

        if (timeleft < 10) {
            a.unshift("0", "0");
        } else if (timeleft < 100) {
            a.unshift("0");
        }

        Crafty.e("Timer1").destroy();
        Crafty.e("Timer1").addComponent("wchar" + a[0]).attr({
            x: 25 * 32,
            y: 9,
            z: 2
        });

        Crafty.e("Timer2").destroy();
        Crafty.e("Timer2").addComponent("wchar" + a[1]).attr({
            x: 26 * 32,
            y: 9,
            z: 2
        });

        Crafty.e("Timer3").destroy();
        Crafty.e("Timer3").addComponent("wchar" + a[2]).attr({
            x: 27 * 32,
            y: 9,
            z: 2
        });

        if (timeleft == 11) {
            Crafty.audio.play("runningoutoftime");
        }

    },
    1000);
*/
}

Crafty.c("Player", {

    movementSpeed: 8,
    lives: 1,
    score: 0,
    limit: 1,
    collected: 0,

    init: function() {
        this.score = 0,
        this.collected = 0,
        this.limit = 1,
        /*
    this.infos = {
    lives :$('.lives'),
    score: $('.score'),
    hp:this.bars.hp.find('.text'),
    heat:this.bars.heat.find('.text'),
    shield:this.bars.shield.find('.text'),
    alert:$('.alert')
    }
    */
        this
        .addComponent("2D", "Canvas", "Dash", "Blockway", "Collision", "SpriteAnimation", "Platform")
        /*Add needed Components*/
        .animate("StandingAnimation", [
        [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
        [7, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
        [6, 2], [7, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]
        ])
        .animate('RightWalking', 0, 5, 7)
        .animate('LeftWalking', 0, 4, 7)
        .stop()
        .animate("StandingAnimation", 10, -1)
        .blockway(32)
        //change direction when a direction change event is received
        .bind("NewDirection", function(direction) {
            if (direction.x < 0) {
                if (!this.isPlaying("LeftWalking"))
                this.stop().animate("LeftWalking", 10, -1)
            }
            if (direction.x > 0) {
                if (!this.isPlaying("RightWalking"))
                this.stop().animate("RightWalking", 10, -1)
            }
            if (direction.y < 0) {
                if (!this.isPlaying("LeftWalking"))
                this.stop().animate("LeftWalking", 10, -1)
            }
            if (direction.y > 0) {
                if (!this.isPlaying("RightWalking"))
                this.stop().animate("RightWalking", 10, -1)
            }
            if (!direction.x && !direction.y) {
                this.stop().animate("StandingAnimation", 10, -1);
            }
        })
        .bind('KeyUp', function(e) {
            this.stop().animate("StandingAnimation", 10, -1);
        })
        .bind('Moved', function(from) {
            // Stone, Steel & Brick
            if (this.hit('Stone') || this.hit('Steel') || this.hit('Brick')) {
                this.attr({
                    x: from.x,
                    y: from.y
                });
            } else {
                Crafty.audio.play("movedirt");
            }
        })
        .onHit('Dirt', function(ent) {
            // destroy item
            ent[0].obj.destroy();
        })
        .onHit('Diamond', function(ent) {
            Crafty.audio.play("pickupdiamond");
            ent[0].obj.destroy();

            this.collected += 1;

            if (this.collected == this.limit) {
                Crafty.audio.play("crack");
                Crafty.e("Finish").destroy();
                Crafty.e("FinishLine").attr({
                    x: 1216,
                    y: 544,
                    z: 3
                });
            }

            if (this.collected > this.limit) {
                this.score += 15;
            } else {
                this.score += 10;
            }

        })
        .onHit('FinishLine', function(ent) {
            Crafty.audio.play("bonuspoints");
        })
        .bind("EnterFrame", function(frame) {
          log(this.map());
          //
        }).
        bind("Killed", function() {
          
          // explosion effect voice
          Crafty.audio.play("explosion");

          // explosion effect to surrounding cells
          for (var i = this.x - 32; i <= this.x + 32; i += 32) {
              //log('i' + i)
              for (var j = this.y - 32; j <= this.y + 32; j += 32) {
                  //log('j' + j)
                  Crafty.e("Explosion").attr({
                      x: i,
                      y: j,
                      z: 3
                  });
              };
          };

          // background music for result view
          Crafty.audio.play("music", -1);

          var $stage = $('#cr-stage');
          var h = $stage.css('height');
          var w = $stage.css('width');

          $('body').append('<div style="position: absolute; left: 0; top: 0; width: ' + w + '; height : ' + h + '; font-family: Lucida Grande; text-align: center; box-sizing: border-box; padding: 200px; background: rgba(0,0,0,.7); font-size: 4em; color: yellow; z-index: 888;">Sait ' + this.score + ' pistettä</div>');

          // destroy player
          this.destroy();
          
        }) 

        return this;
    }

});

Crafty.c("Dirt", {
    init: function() {
        this.addComponent("2D", "Canvas", "Platform", "DirtSprite");
    }
});

Crafty.c("Stone", {
    previous_y: 0,
    next_y: 0,
    from_y: 0,
    init: function() {
        this.addComponent("2D", "Canvas", "Collision", "StoneSprite", "Gravity", "Solid", "Platform")
        .gravity("Platform")
        .gravityConst(1)
        .bind('Change', function(from) {
          //
        })
        .bind("EnterFrame", function(frame) {
          //
        })
    }
});

Crafty.c("Diamond", {
    init: function() {
        this.addComponent("2D", "Canvas", "Collision", "Gravity", "SpriteAnimation", "diamond1", "Platform")
        .stop()
        .animate("DiamondAnimation", 0, 10, 7)
        .animate("DiamondAnimation", 8, -1)
        .gravity("Platform")
        .gravityConst(1)
        .onHit("Player",
        function(ent) {
            ent[0].obj.die();
        })
        .bind('Move',
        function(from) {
            Crafty.audio.play("diamond1");
        })
    }
});

Crafty.c("Door", {
    init: function() {
        this.start = 1,
        this.addComponent("2D", "Canvas", "SpriteAnimation", "DoorSprite")
        .stop()
        .animate("DoorAnimation", 1, 6, 0)
        .animate("DoorAnimation", 16, 6)
        .bind('EnterFrame', function(frame) {
            if (!this.isPlaying('DoorAnimation') && this.start) {
                //
                this.start = 0;
                // Create the player
                var obj = Crafty.e("Player").attr({
                    x: 3 * 32,
                    y: 3 * 32,
                    z: 3
                });
            }
        })
    }
});

Crafty.c("Explosion", {
    init: function() {
        this.addComponent("2D", "Canvas", "SpriteAnimation", "explosion1")
        .stop()
        .animate("ExplosionAnimation", 2, 7, 7)
        .animate("ExplosionAnimation", 16, -1)
    }
});

Crafty.c("Brick", {
    init: function() {
        this.addComponent("2D", "Canvas", "BrickSprite", "Platform");
    }
});

Crafty.c("Steel", {
    init: function() {
        this.addComponent("2D", "Canvas", "SteelSprite", "Platform");
    }
});

Crafty.c("Finish", {
    init: function() {
        this.start = 1,
        this.addComponent("2D", "Canvas", "SteelSprite", "Platform")
    }
});

Crafty.c("FinishLine", {
    init: function() {
        this.addComponent("2D", "Canvas", "SpriteAnimation", "DoorSprite", "Platform")
        .stop()
        .animate("FinishAnimation", 1, 6, 2)
        .animate("FinishAnimation", 32, -1)
    }
});

