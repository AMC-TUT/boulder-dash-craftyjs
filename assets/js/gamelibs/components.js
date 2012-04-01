var Game = {
    timer: null,
    reset: function() {
        this.direction = '',
        this.time = 150,
        this.score = 0,
        this.diamond = {
            value: 10,
            objective: 12,
            collected: 0,
        }
        $('.game-score').text(Game.zeroPad(this.score, 7));
        $('.game-time > span').text(this.time);
        $('.game-collected').text(this.diamond.collected);
        $('.game-diamond-value').text(this.diamond.value);
        $('.game-diamond-objective').text(this.diamond.objective);

        //when loaded
        Crafty.audio.play("uncover");
        // show the game
        Crafty.scene('Game');
    },
    timerStart: function() {
        var $time = $('.game-time > span');
        var time = parseInt($time.text());

        return setInterval(function() {
            time -= 1;
            if (time == 0) {
                /*
                _.each(Crafty.map, function(obj){ 
                    if(!_.isUndefined(obj) && obj.__c.Player) {
                        var player = Crafty.map.search({
                            _x: obj._x,
                            _y: obj._y,
                            _w: game.cellsize,
                            _h: game.cellsize
                        })[0];
                        
                        player.trigger('Killed');
                    }
                    
                });
                */
                Crafty.e("Player").attr({ x: -92, y: -92 }).trigger('Killed');
            }

            if (time == 11) {
                Crafty.audio.play("runningoutoftime");
            }

            if(time < 0) {
                time = 0;
            }

            $time.text(Game.zeroPad(time, 3));

        },
        1000);
    },
    timerStop: function(timer) {
        clearInterval(timer);
    },
    zeroPad: function(num, count) {
        var numZeropad = num + '';
        while (numZeropad.length < count) {
            numZeropad = "0" + numZeropad;
        }
        return numZeropad;
    },
    previousPos: function(current, direction) {
        // find previous cell which is devidable with cellSize
        // current is either y || x -axis depending on direction
        // count difference to valid cell value with mobulo
        var modulo = current % game.cellsize;

        var previousPoint;

        switch (direction)
        {
        case 'n':
            previousPoint = current + modulo;
            break;
        case 'e':
            previousPoint = current - modulo;
            break;
        case 's':
            previousPoint = current - modulo;
            break;
        case 'w':
            previousPoint = current + modulo;
            break;
        }

        // if module == cellsize then previous and current pos are the same
        if (previousPoint == game.cellsize) previousPoint = current;

        // return valid position
        return previousPoint;
    }
}

Crafty.c("Player", {
    score: 0,
    timer: null,
    direction: "",

    init: function() {
        this.direction = '',
        this.timer = Game.timerStart();
        this.score = 0,
        this.diamond = {
            value: 10,
            objective: 12,
            collected: 0,
        },

        this
        .addComponent("2D", "Canvas", "Dash", "Fourway", "Collision", "SpriteAnimation", "Platform")
        /*Add needed Components*/
        .animate("StandingAnimation", [
        [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
        [7, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
        [6, 2], [7, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]
        ])
        .animate('RightWalking', 0, 5, 7)
        .animate('LeftWalking', 0, 4, 7)
        .animate("StandingAnimation", 10, -1)
        .fourway(game.cellsize)
        //change direction when a direction change event is received
        .bind("NewDirection",
        function(direction) {
            if (direction.x < 0) {
                if (!this.isPlaying("LeftWalking")) {
                    this.stop().animate("LeftWalking", 10, -1);
                    this.direction = 'w';
                }
            }
            if (direction.x > 0) {
                if (!this.isPlaying("RightWalking")) {
                    this.stop().animate("RightWalking", 10, -1);
                    this.direction = 'e';
                }
            }
            if (direction.y < 0) {
                if (!this.isPlaying("LeftWalking")) {
                    this.stop().animate("LeftWalking", 10, -1);
                    this.direction = 'n';
                }

            }
            if (direction.y > 0) {
                if (!this.isPlaying("RightWalking")) {
                    this.stop().animate("RightWalking", 10, -1)
                    this.direction = 's';
                }
            }
            if (!direction.x && !direction.y) {
                this.stop().animate("StandingAnimation", 10, -1);
            }
        })
        .bind('KeyUp',
        function(e) {
            this.stop().animate("StandingAnimation", 10, -1);
        })
        .bind('Moved',
        function(from) {
            // Stone, Steel & Brick
            if (this.hit('Stone') || this.hit('Steel') || this.hit('Brick')) {
                this.attr({
                    x: from.x,
                    y: from.y
                });
            } else {
                Crafty.audio.play("movedirt");
            }

            if (from.x % 32 == 0 && from.y % 32 == 0) {
                for (var i = from.x - game.cellsize; i <= from.x + game.cellsize; i += game.cellsize) {
                    for (var j = from.y - game.cellsize; j <= from.y + game.cellsize; j += game.cellsize) {

                        if (! (from.y - game.cellsize == j && from.x == i)
                        && !(from.x - game.cellsize == i && this.direction == 'w')
                        && !(from.x + game.cellsize == i && this.direction == 'e')) {

                            var stone = Crafty.map.search({
                                _x: i,
                                _y: j,
                                _w: game.cellsize,
                                _h: game.cellsize
                            })[0];

                            if (typeof stone !== "undefined" && stone.__c.Stone) {
                                stone.trigger('Move');
                            }
                        }
                    };
                };
            }

        })
        .bind('Move',
        function(from) {
            if (this.hit('Stone')) {

                // if player move horizontaly and hit the stone
                // check if there is empty space after the
                // stone, then push the stone to the empty space
                if (this._y == from._y) {

                    var stone = Crafty.map.search({
                        _x: this._x,
                        _y: this._y,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];

                    var ent;

                    if (this.direction == 'e') {
                        var validPos = Game.previousPos(this._x, this.direction);
                        ent = Crafty.map.search({
                            _x: validPos + game.cellsize,
                            _y: this._y,
                            _w: game.cellsize,
                            _h: game.cellsize
                        })[0];

                        // if there is not block behind behind the stone
                        if (typeof ent === "undefined") {
                            stone.x = stone._x + game.cellsize;
                        }

                    } else if (this.direction == 'w') {
                        var validPos = Game.previousPos(this._x, this.direction);
                        ent = Crafty.map.search({
                            _x: validPos - game.cellsize,
                            _y: this._y,
                            _w: game.cellsize,
                            _h: game.cellsize
                        })[0];

                        // if there is not block behind behind the stone
                        if (typeof ent === "undefined") {
                            stone.x = stone._x - game.cellsize;
                        }
                    }
                }
            }
        })
        .onHit('Dirt',
        function(ent) {
            // destroy item
            ent[0].obj.destroy();

        })
        .onHit('Diamond',
        function(ent) {
            // play sound
            Crafty.audio.play("PickUpSound");

            // destroy diamond
            ent[0].obj.destroy();

            // add score
            this.diamond.collected += 1;
            $('.game-collected').text(this.diamond.collected);

            // if score reaches the level limit value
            if (this.diamond.collected == this.diamond.objective) {
                // remove steel from finish
                steel = Crafty.map.search({
                    _x: 1216,
                    _y: 512,
                    _w: game.cellsize,
                    _h: game.cellsize
                })[0];
                steel.destroy();
                // add finish
                Crafty.e("Finish").attr({
                    x: 1216,
                    y: 512,
                    z: 2,
                });
                // play sound
                Crafty.audio.play("crack");
            }

            if (this.score > this.diamond.objective) {
                $('.game-diamond-value').text('15');
                this.diamond.value = 15;
            }

            this.score += this.diamond.value;
            $('.game-score').text(Game.zeroPad(this.score, 7));

        })
        .onHit('Finish',
        function(ent) {
            // play sound
            Crafty.audio.play("bonuspoints");

            ent[0].obj.destroy();

            Game.timerStop(this.timer);

            // TODO countdown
            this.score += parseInt($('.game-time > span').text());
            $('.game-score').text(Game.zeroPad(this.score, 7));
            $('.game-time > span').text('000');

            // remove player
            this.disableControl();

        })
        .bind("Killed",
        function(ent) {

            this.disableControl();

            var player = this;

            Game.timerStop(this.timer);

            // explosion effect voice
            Crafty.audio.play("explosion");

            // array for get explosion elements fast 1 snd later
            var xplosions = [];

            // explosion effect to surrounding cells
            for (var i = this._x - game.cellsize; i <= this._x + game.cellsize; i += game.cellsize) {
                //log('i' + i)
                for (var j = this._y - game.cellsize; j <= this._y + game.cellsize; j += game.cellsize) {
                    var xpl = Crafty.e("Explosion").attr({
                        x: i,
                        y: j,
                        z: 3
                    });

                    xplosions.push(xpl);
                };
            };

            // after 1 second destroy all elements inside explosion area
            setTimeout(function() {
                _.each(xplosions,
                function(xpl) {
                    var els = Crafty.map.search({
                        _x: xpl._x,
                        _y: xpl._y,
                        _w: game.cellsize,
                        _h: game.cellsize
                    });
                    _.each(els,
                    function(el) {
                        el.destroy();
                    });
                });
            },
            1000);

            // play background music a tiny bit after explosion
            setTimeout(function() {
                // background music for result view
                //Crafty.audio.play("music", -1);
                //var m = Crafty.e('BackgroundMusic').attr({ x: -64, y: -64, z: 1 });
                //m.trigger('Play');
                },
            1100);

        })

        return this;
    },

});

Crafty.c("Dirt", {
    init: function() {
        this.addComponent("2D", "Canvas", "Platform", "DirtSprite");
    }
});

Crafty.c("Stone", {

    direction: '',

    init: function() {
        this.direction = 'n',
        this.addComponent("2D", "Canvas", "Collision", "StoneSprite", "Gravity", "Solid", "Platform")
        .gravity("Platform")
        .gravityConst(.5)
        .bind('Move',
        function(from) {

            if (typeof from === "undefined" || typeof this._x === "undefined") {
                this.direction = 's';
            } else {

                // define move direction
                if (this._x > from._x) {
                    this.direction = 'e';
                } else if (this._x < from._x) {
                    this.direction = 'w';
                } else {
                    this.direction = 's';
                }
            }

            //log('Stone, direction: ' + this.direction);
            // check object below
            var obj = Crafty.map.search({
                _x: this._x,
                _y: this._y + game.cellsize,
                _w: game.cellsize,
                _h: game.cellsize
            })[0];

            // if player kill it with event triggering
            if (typeof obj !== "undefined" && obj.__c.Player) {
                // trigger event
                obj.trigger("Killed");
                // move player away to make sure that the
                // event is not triggering multiple times
                obj.attr({
                    x: -game.cellsize,
                    y: -game.cellsize
                });
                // destroy the stone
                this.destroy();

            } else if (typeof obj !== "undefined" && obj.__c.Stone) {

                // check if there is empty space next to stone
                if (this.direction == 'w' && (this._x % game.cellsize) == 0) {
                    //log('w' + (this._x % game.cellsize))
                    var w = Crafty.map.search({
                        _x: this._x - game.cellsize,
                        _y: this._y,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];
                    var sw = Crafty.map.search({
                        _x: this._x - game.cellsize,
                        _y: this._y + game.cellsize,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];

                    if (typeof w === "undefined" && typeof sw === "undefined") {
                        this.x = this._x - game.cellsize;
                    }

                } else if (this.direction == 'e' && (this._x % game.cellsize) == 0) {
                    //log('e' + (this._x % game.cellsize))
                    var e = Crafty.map.search({
                        _x: this._x + game.cellsize,
                        _y: this._y,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];
                    var se = Crafty.map.search({
                        _x: this._x + game.cellsize,
                        _y: this._y + game.cellsize,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];

                    if (typeof e === "undefined" && typeof se === "undefined") {
                        //log('hae naista: ' + (this._x + game.cellsize) + ' ' + (this._y) + ' ja ' + (this._x + game.cellsize) + ' ' + (this._y + game.cellsize) )
                        //log('itse: ' + this._x + ' ' + this._y)
                        this.x = this._x + game.cellsize;
                    }

                } else if (this.direction == 's' && (this._y % game.cellsize) == 0) {

                    var e = Crafty.map.search({
                        _x: this._x + game.cellsize,
                        _y: this._y,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];
                    var se = Crafty.map.search({
                        _x: this._x + game.cellsize,
                        _y: this._y + game.cellsize,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];

                    var w = Crafty.map.search({
                        _x: this._x - game.cellsize,
                        _y: this._y,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];
                    var sw = Crafty.map.search({
                        _x: this._x - game.cellsize,
                        _y: this._y + game.cellsize,
                        _w: game.cellsize,
                        _h: game.cellsize
                    })[0];

                    if (typeof e === "undefined" && typeof se === "undefined") {
                        this.x = this._x + game.cellsize;
                    } else if (typeof w === "undefined" && typeof sw === "undefined") {
                        this.x = this._x - game.cellsize;
                    }

                }

            }

            if (typeof from !== "undefined") {
                Crafty.audio.play("BoulderSound");
            }

            this.direction = '';
        })

        return this;
    }
});

Crafty.c("Diamond", {
    init: function() {
        this.addComponent("2D", "Canvas", "Gravity", "SpriteAnimation", "DiamondSprite", "Platform", "StoneDiamond")
        .stop()
        .animate("DiamondAnimation", 0, 10, 7)
        .animate("DiamondAnimation", 8, -1)
        .gravity("Platform")
        .gravityConst(.5)
        .bind('Move',
        function(from) {

            // check object below
            var obj = Crafty.map.search({
                _x: this._x,
                _y: this._y + game.cellsize,
                _w: game.cellsize,
                _h: game.cellsize
            })[0];

            // if player kill it with event triggering
            if ( !! obj && obj.__c.Player) {
                // trigger event
                obj.trigger("Killed");
                // move player away to make sure that the
                // event is not triggering multiple times
                obj.attr({
                    x: -game.cellsize,
                    y: -game.cellsize
                });
            } else {
                // play falling sound
                Crafty.audio.play("DiamondSound");
            }
        })

        return this;
    }
});

Crafty.c("Door", {
    init: function() {
        this.start = 1,
        this.addComponent("2D", "Canvas", "SpriteAnimation", "DoorSprite")
        .stop()
        .animate("DoorAnimation", 1, 6, 0)
        .animate("DoorAnimation", 16, 6)
        .bind('EnterFrame',
        function(frame) {
            if (!this.isPlaying('DoorAnimation') && this.start) {
                //
                this.start = 0;

                // destroy Door entity
                var el = Crafty.map.search({
                    _x: 96,
                    _y: 64,
                    _w: game.cellsize,
                    _h: game.cellsize
                })[0];
                el.destroy();

                // Create the player
                var obj = Crafty.e("Player").attr({
                    x: 96,
                    y: 64,
                    z: 3
                });
            }
        })
    }
});

Crafty.c("Explosion", {
    init: function() {
        this.addComponent("2D", "Canvas", "SpriteAnimation", "ExplosionSprite")
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
        this.addComponent("2D", "Canvas", "SpriteAnimation", "DoorSprite", "Platform")
        .stop()
        .animate("FinishAnimation", 1, 6, 2)
        .animate("FinishAnimation", game.cellsize, -1)
    }
});
/*
        Crafty.c('BackgroundMusic', {
        init: function() {
        this.addComponent("2D", "Canvas")
        .bind('Play', function() {
        Crafty.audio.play('music');
        })
        }
        });
        */
