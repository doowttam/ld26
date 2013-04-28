// http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
KEY = {
    pressed: {},
    codes: {
        "LEFT":  37,
        "UP":    38,
        "RIGHT": 39,
        "DOWN":  40
    },
    isDown: function(keyCode) {
        return this.pressed[keyCode];
    },
    onKeyDown: function(event) {
        this.pressed[event.keyCode] = true;
    },
    onKeyUp: function(event) {
        delete this.pressed[event.keyCode];
    }
};

OEN = (function(doc, win, $, map) {
    var lastRun = Date.now();
    var canvas  = null;
    var context = null;

    var currentWorld = 'world1';
    var tileSize     = map.tileSize;

    var hero = {
        x: 60,
        y: 60,
        draw: function(center) {
            var sprite = loader.asset['img/oen_sprites.png'];
            var width = 32;

            if ( this.moving ) {
                if ( Date.now() - this.lastFrame > 150 || !this.lastFrame ) {
                    this.frame++;
                    this.lastFrame = Date.now();
                }
            }
            else {
                this.frame = 0;
            }

            var offset = width * (this.frame % 4);
            context.drawImage(sprite, offset, 0, width, width, center.x - (width/2), center.y - (width/2), width, width);
        },
        update: function(dt) {
            this.moving = false;
            if ( KEY.isDown(KEY.codes.LEFT) ) {
                hero.x -= Math.ceil(20 * dt);
                this.moving = true;
            }
            if ( KEY.isDown(KEY.codes.RIGHT) ) {
                hero.x += Math.ceil(20 * dt);
                this.moving = true;
            }
            if ( KEY.isDown(KEY.codes.DOWN) ) {
                hero.y += Math.ceil(20 * dt);
                this.moving = true;
            }
            if ( KEY.isDown(KEY.codes.UP) ) {
                hero.y -= Math.ceil(20 * dt);
                this.moving = true;
            }
        }
    };

    var loader = {
        init: function(callback) {
            this.finished = callback;

            for ( var i = 0; i < this.images.length; i++ ) {
                var img = new Image();
                img.addEventListener('load', function() {
                    loader.onLoad();
                });
                img.src = this.images[i];
                this.asset[this.images[i]] = img;
            }
        },
        loaded: 0,
        images: [ 'img/oen_sprites.png' ],
        asset: {},
        onLoad: function() {
            this.loaded++;
            if ( this.loaded >= this.images.length ) {
                this.finished();
            }
        }
    };

    var drawFrame = function() {
        var now = Date.now();
        var dt  = (now - lastRun) / 1000.0;
        canvas.width = canvas.width;

        hero.update(dt);
        drawMap();

        lastRun = now;
        requestAnimationFrame(drawFrame);
    };

    var getCoords = function(coord, center) {
        var tileOffset = coord % tileSize;
        var tileCoord  = -1 * tileOffset;

        var offsetTiles = Math.floor(center / tileSize);
        var mapTile     = (coord - tileOffset) / tileSize;

        return {
            firstTileCoord: tileCoord,             // The coord where we start drawing tiles
            firstTile:      mapTile - offsetTiles, // The first tile of the map to draw
        };
    };

    var drawMap = function() {
        var center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        var coordsX = getCoords(hero.x, center.x);
        var coordsY = getCoords(hero.y, center.y);

        var tileY = coordsY.firstTile;
        for (var y = coordsY.firstTileCoord; y < canvas.height; y += tileSize) {

            var tileX = coordsX.firstTile;
            for (var x = coordsX.firstTileCoord; x < canvas.width; x += tileSize) {
                drawTile(tileX, tileY, x, y, coordsX.offsetTiles);

                tileX += 1;
            }
            tileY += 1;
        }

        hero.draw(center);
    };

    var drawTile = function(tileX, tileY, vpX, vpY, offset) {
        var world = map[currentWorld];
        //console.log('drawing map tile: (' + tileX + ', ' + tileY + ') at (' + vpX + ', ' + vpY + ')');

        var row = world[tileY];
        // Skip the row if it doesn't exist
        if ( typeof row === 'undefined' ) {
            return;
        }

        var tile = row[tileX];

        // If tile exists, draw it
        if ( typeof tile !== 'undefined' ) {
            var color;
            if ( tile == 0 ) {
                color = 'gray';
            }
            else if ( tile == 1 ) {
                color = 'pink';
            }
            else if ( tile == 2 ) {
                color = 'green';
            }
            else if ( tile == 3 ) {
                color = 'red';
            }
            else {
                color = 'black';
            }

            context.fillStyle = color;
            context.fillRect(vpX, vpY, tileSize, tileSize);
        }
    };

    return {
        init: function() {
            canvas  = doc.getElementById('game-canvas');
            context = canvas.getContext('2d');

            win.addEventListener('keyup', function(e) {
                KEY.onKeyUp(e);
            });

            win.addEventListener('keydown', function(e) {
                KEY.onKeyDown(e);
            });

            loader.init(function() {
                OEN.play();
            })
        },

        play: function() {
            requestAnimationFrame(drawFrame);
        }
    };
}(document, window, jQuery, MAP));

window.addEventListener('load', function() {
    OEN.init();
});

