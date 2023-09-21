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
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            /* add more cases for starting to walk here */

            // in this case, we are keyboard ready (player provides input) + arrow is pressed
            if (this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "walk", 
                    direction: state.arrow,
                })
            }
            this.updateSprite(state);
        } 
    }
    
    startBehavior(state, behavior) {
        // set character direction to whatever behavior has
        this.direction = behavior.direction;
        if (behavior.type === "walk") {
            // stop here if space is taken -- cannot walk
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            }
            // ready to walk!
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16; // reset progress
        }
    }

    // movement code
    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change; // apply change to the coord
        this.movingProgressRemaining -= 1; // decrement cells left to move
    }

    // update sprite animations with movement
    // sprite faces moving dir
    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }           
}