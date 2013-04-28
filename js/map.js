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
        // Tree front
        {
            collide: 1,
            texture: {
                offsetX: 50,
                offsetY: 32
            }
        },
        // Tree middle
        {
            collide: 1,
            texture: {
                offsetX: 0,
                offsetY: 32
            }
        },
        // Tree end
        {
            collide: 1,
            texture: {
                offsetX: 100,
                offsetY: 32
            }
        },
        { collide: 0 }, // Entry portal
        { collide: 0 }  // Exit portal
    ],
    world1: [
        [2,1,1,1,1,1,1,2,1,1,1,1,1,2],
        [2,0,0,4,0,0,0,1,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,3,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,2,0,0,3,0,0,0,0,0,0,2],
        [2,0,0,2,0,0,2,0,0,0,0,0,3,2],
        [2,0,0,2,0,0,2,3,0,0,0,5,2,2],
        [2,3,3,2,3,3,2,2,3,3,3,3,2,2]
    ],
    world2: [
        [0,0,0,0,0],
        [0,1,1,1,0],
        [0,1,1,1,0],
        [0,0,2,0,0],
        [0,0,0,0,0]
    ]
};
