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

    var hud = {
        size: 50,
        init: function() {
            this.canvas  = doc.getElementById('hud-canvas');
            this.context = this.canvas.getContext('2d');
        },
        draw: function() {
            var startX = this.size;
            var startY = this.canvas.height - this.size;
            var width  = this.canvas.width - (this.size * 2);

            this.context.fillStyle = 'red';
            this.context.fillRect(startX, startY, width, this.size);
        }
    };

    var drawFrame = function() {
        var now = Date.now();
        var dt  = (now - lastRun) / 1000.0;
        canvas.width = canvas.width;

        OEN.hero.update(dt);
        drawMap();

        lastRun = now;
        requestAnimationFrame(drawFrame);
    };

    var drawMap = function() {
        var center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        var coordsX = OEN.getCoords(OEN.hero.x, center.x);
        var coordsY = OEN.getCoords(OEN.hero.y, center.y);

        var tileY = coordsY.firstTile;
        for (var y = coordsY.firstTileCoord; y < canvas.height; y += tileSize) {

            var tileX = coordsX.firstTile;
            for (var x = coordsX.firstTileCoord; x < canvas.width; x += tileSize) {
                drawTile(tileX, tileY, x, y, coordsX.offsetTiles);

                tileX += 1;
            }
            tileY += 1;
        }

        OEN.hero.draw(center);
    };

    var drawBGTile = function(vpX, vpY) {
        // Draw the middle tree texture, it'll serve as a background
        var props   = map.tiles[2];
        var texture = props.texture;
        var sprite  = OEN.loader.asset['img/oen_sprites.png'];
        context.drawImage(sprite, texture.offsetX, texture.offsetY, tileSize, tileSize, vpX, vpY, tileSize, tileSize);
    }

    var drawTile = function(tileX, tileY, vpX, vpY, offset) {
        var world = map[currentWorld];
        //console.log('drawing map tile: (' + tileX + ', ' + tileY + ') at (' + vpX + ', ' + vpY + ')');

        var row = world[tileY];
        // Skip the row if it doesn't exist
        if ( typeof row === 'undefined' ) {
            drawBGTile(vpX, vpY);
            return;
        }

        var tile = row[tileX];

        // If tile exists, draw it
        if ( typeof tile !== 'undefined' ) {
            var props = map.tiles[tile];

            if ( props.texture ) {
                var texture = props.texture;
                var sprite  = OEN.loader.asset['img/oen_sprites.png'];
                context.drawImage(sprite, texture.offsetX, texture.offsetY, tileSize, tileSize, vpX, vpY, tileSize, tileSize);
            }
            else {
                var color;
                if ( tile == 0 ) {
                    color = 'gray';
                }
                else if ( tile == 1 ) {
                    color = 'pink';
                }
                else if ( tile == 4 ) {
                    color = 'green';
                }
                else if ( tile == 5 ) {
                    color = 'red';
                }
                else {
                    color = 'black';
                }

                context.fillStyle = color;
                context.fillRect(vpX, vpY, tileSize, tileSize);
            }
        }
        else {
            drawBGTile(vpX, vpY);
        }
    };

    return {
        init: function() {
            canvas  = doc.getElementById('game-canvas');
            context = canvas.getContext('2d');

            OEN.hero.init(canvas, context);

            win.addEventListener('keyup', function(e) {
                KEY.onKeyUp(e);
            });

            win.addEventListener('keydown', function(e) {
                KEY.onKeyDown(e);
            });

            OEN.loader.init(function() {
                OEN.play();
            })

            hud.init();
        },

        coordsToTile:  function(x, y) {
            var xOffset = x % tileSize;
            var xTile = (x - xOffset) / tileSize;

            var yOffset = y % tileSize;
            var yTile = (y - yOffset) / tileSize;

            return {
                x: xTile,
                y: yTile
            };
        },

        getPossibleCollisionTiles: function(x, y) {
            var world = map[currentWorld];

            var tiles = [];
            for (var iy = y - 1; iy <= y + 1; iy++) {
                // Check if row exists
                var row  = world[iy];
                if ( typeof row === 'undefined' ) {
                    continue;
                }

                for (var ix = x - 1; ix <= x + 1; ix++) {
                    if ( ix == x && iy == y ) {
                        continue;
                    }

                    var tile = row[ix];
                    if ( typeof tile === 'undefined' ) {
                        continue;
                    }

                    var props = map.tiles[tile];

                    if ( props.collide ) {
                        var bounds = map.getBounds(ix, iy);
                        tiles.push({x: ix, y: iy, props: props, bounds: bounds});
                    }
                }
            }

            return tiles;
        },

        getCoords: function(coord, center) {
            var mapTileOffset  = coord % tileSize;
            var viewportOffset = center % tileSize;

            var offsetTiles = Math.ceil(center / tileSize);
            var mapTile     = (coord - mapTileOffset) / tileSize;

            var tileCoord  = -1 * (viewportOffset + mapTileOffset);
            return {
                firstTileCoord: tileCoord,             // The coord where we start drawing tiles
                firstTile:      mapTile - offsetTiles, // The first tile of the map to draw
            };
        },

        play: function() {
            requestAnimationFrame(drawFrame);
            hud.draw();
        }
    };
}(document, window, jQuery, MAP));

OEN.loader = (function(doc, win, $, map) {
    return {
        init: function(callback) {
            this.finished = callback;

            for ( var i = 0; i < this.images.length; i++ ) {
                var img = new Image();
                img.addEventListener('load', function() {
                    OEN.loader.onLoad();
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
}(document, window, jQuery, MAP));

OEN.hero = (function(doc, win, $, map) {
    return {
        x: 325,
        y: 150,
        size: 32,
        init: function(canvas, context) {
            this.canvas  = canvas;
            this.context = context;
        },
        getBounds: function(x, y) {
            return {
                x1: x - this.size / 2,
                x2: x + this.size / 2,
                y1: y - this.size / 2,
                y2: y + this.size / 2
            };
        },
        draw: function(center) {
            var sprite = OEN.loader.asset['img/oen_sprites.png'];
            var width  = this.size;
            var offset = 0;

            if ( this.moveState.moving ) {
                if ( Date.now() - this.lastFrame > 150 || !this.lastFrame ) {
                    this.frame++;
                    this.lastFrame = Date.now();
                }

                frameOffset = 1;
                if ( this.moveState.right ) {
                    frameOffset = 5;
                }

                offset = width * (frameOffset + this.frame % 4);
            }
            else {
                this.frame = 0;
            }

            this.context.drawImage(sprite, offset, 0, width, width, center.x - (width/2), center.y - (width/2), width, width);
        },
        checkBoxCollision: function(x, y, other) {
            var bounds = this.getBounds(x, y);
            if (
                bounds.x1 > other.x2    // Hero is left
                || bounds.x2 < other.x1 // Hero is right
                || bounds.y1 > other.y2 // Hero is below
                || bounds.y2 < other.y1 // Hero is above
            ) {
                return false;
            }
            return true;
        },
        checkCollision: function(x, y) {
            var tileCoords = OEN.coordsToTile(x, y);
            var tiles      = OEN.getPossibleCollisionTiles(tileCoords.x, tileCoords.y);

            var collides = false;
            for (var i = 0; i < tiles.length; i++ ) {
                var tile = tiles[i];
                var tileCollides = this.checkBoxCollision(x, y, tile.bounds);
                if ( tileCollides ) {
                    collides = true;
                }
            }
            return collides;
        },
        update: function(dt) {
            this.moveState = { moving: false };

            var nextX;
            var nextY;

            if ( KEY.isDown(KEY.codes.LEFT) ) {
                nextX = this.x - Math.ceil(20 * dt);
                this.moveState.moving = true;
                this.moveState.left   = true;
            }
            if ( KEY.isDown(KEY.codes.RIGHT) ) {
                nextX = this.x + Math.ceil(20 * dt);
                this.moveState.moving = true;
                this.moveState.right  = true;
            }
            if ( KEY.isDown(KEY.codes.DOWN) ) {
                nextY = this.y + Math.ceil(20 * dt);
                this.moveState.moving = true;
                this.moveState.down   = true;
            }
            if ( KEY.isDown(KEY.codes.UP) ) {
                nextY = this.y - Math.ceil(20 * dt);
                this.moveState.moving = true;
                this.moveState.up     = true;
            }

            if ( typeof nextX !== 'undefined' ) {
                if ( !this.checkCollision(nextX, this.y) ) {
                    this.x = nextX;
                }
            }

            if ( typeof nextY !== 'undefined' ) {
                if ( !this.checkCollision(this.x, nextY) ) {
                    this.y = nextY;
                }
            }
        }
    };
}(document, window, jQuery, MAP));

window.addEventListener('load', function() {
    OEN.init();
});

