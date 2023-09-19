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

        // configure animation + initial state
        this.animations = config.animations || {
            idleDown: [
                [0,0]
            ]
        }
        this.currentAnimation = config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;

        // reference the game object
        this.gameObject = config.gameObject;
    }

    // method to draw sprites
    draw(ctx) {
        // has adjustments built in
        const x = this.gameObject.x - 8;
        const y = this.gameObject.y - 18;

        // wait til img is loaded to draw
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)
        this.isLoaded && ctx.drawImage(this.image,
            0, 0,
            32, 32,
            x, y,
            32, 32
        );
    }
}