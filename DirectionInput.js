class DirectionInput {
    constructor() {
        this.heldDirections = []; // keep track of arrow presses in array

        this.map = {
            "ArrowUp": "up",
            "KeyW": "up",
            "ArrowDown": "down",
            "KeyS": "down",
            "ArrowLeft": "left",
            "KeyA": "left",
            "ArrowRight": "right",
            "KeyD": "right",
        }
    }

    // getter for external things to ask which direction is held rn
    get direction() {
        return this.heldDirections[0];
    }

    // add document bindings
    init() {
        document.addEventListener("keydown", e => {
            const dir = this.map[e.code]; // only want codes for keys we care about (movement keys)
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
                console.log(this.heldDirections);
            }
        });
        document.addEventListener("keyup", e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index, 1);
                console.log(this.heldDirections);
            }
        });

    }
}