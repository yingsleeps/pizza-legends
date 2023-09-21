/* extension of game objects, need more functionalities to 
move around */

class Person extends GameObject {
    constructor(config) {
        super(config); // do normal constructor stuff of the game object
        this.movingProgressRemaining = 0; // this ensures movement stays within grid

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    // updates on every frame
    update(state) {
        this.updatePosition();
        this.updateSprite(state);

        if (this.isPlayerControlled && this.movingProgressRemaining === 0 && state.arrow) {
            this.direction = state.arrow;
            this.movingProgressRemaining = 16; // reset progress
        }
    }

    // movement code
    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change; // apply change to the coord
            this.movingProgressRemaining -= 1; // decrement cells left to move
        }
    }

    // update sprite animations with movement
    // sprite faces moving dir
    updateSprite(state) {
        if (this.isPlayerControlled && this.movingProgressRemaining === 0 && !state.arrow) {
            this.sprite.setAnimation("idle-" + this.direction);
            return;
        }
        
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
        }
    }           
}