/* extension of game objects, need more functionalities to 
move around */

class Person extends GameObject {
    constructor(config) {
        super(config); // do normal constructor stuff of the game object
        this.movingProgressRemaining = 0; // this ensures movement stays within grid

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            "up": ["y", -0.5],
            "down": ["y", 0.5],
            "left": ["x", -0.5],
            "right": ["x", 0.5],
        }
    }

    // updates on every frame
    update(state) {
        this.updatePosition();

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
            this.movingProgressRemaining -= 0.5; // decrement cells left to move
        }
    }
}