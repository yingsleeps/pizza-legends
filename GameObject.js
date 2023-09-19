/* abstraction of the concept of people + items on screen */
class GameObject {
    // passing in an object
    constructor(config) {
        // pass in position of object or default
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";

        // pass in appearance 
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/hero.png",

        });
    }

    update() {

    }
}