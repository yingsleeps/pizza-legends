class Sprite {
    // pass in details for look of the sprite + animations 
    constructor(config) {
        /* animations are objects, keys will be name of the 
        animation + each animation will have a series of frames */

        // set up image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true; // only draw after loaded

        }

        // shadow 
        this.shadow = new Image();
        this.useShadow = true; // config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "/images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        // configure animations + initial state
        this.animations = config.animations || {
            "idle-down": [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up": [ [0,2] ],
            "idle-left": [ [0,3] ],
            "walk-down": [ [1,0], [0,0], [3,0], [0,0] ],
            "walk-right": [ [1,1], [0,1], [3,1], [0,1] ],
            "walk-up": [ [1,2], [0,2], [3,2], [0,2] ],
            "walk-left": [ [1,3], [0,3], [3,3], [0,3] ],
        }
        this.currentAnimation = "idle-down"; // config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        // how many game loop frames to show this one cut of the sprite sheet
        this.animationFrameLimit = config.animationFrameLimit || 8;
        // keep track of how much is left of the limit
        this.animationFrameProgress = this.animationFrameLimit;

        // reference the game object
        this.gameObject = config.gameObject;
    }

    // used to figure out which animation + frame we are on
    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        // downtick frame progress 
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        // reset the counter
        this.animationFrameProgress = this.animationFrameLimit;

        // uptick the frame we are on
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0; 
        }
        }

    // method to draw sprites
    draw(ctx, cameraPerson) {
        // has adjustments built in
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

        // wait til img is loaded to draw
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 32, frameY * 32,
            32, 32,
            x, y,
            32, 32
        )

        this.updateAnimationProgress();
    }
}