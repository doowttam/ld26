MAP = {
    tileSize: 50,
    getBounds: function(x, y) {
        return {
            x1: x * this.tileSize,
            x2: x * this.tileSize + this.tileSize,
            y1: y * this.tileSize,
            y2: y * this.tileSize + this.tileSize
        };
    },
    tiles: [
        { collide: 0 }, // Normal ground
        { collide: 1 }, // Tree
        { collide: 0 }, // Entry portal
        { collide: 0 }  // Exit portal
    ],
    world1: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,2,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,0,0,0,1,1],
        [1,0,0,1,0,0,1,1,0,0,0,3,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    world2: [
        [0,0,0,0,0],
        [0,1,1,1,0],
        [0,1,1,1,0],
        [0,0,2,0,0],
        [0,0,0,0,0]
    ]
};
