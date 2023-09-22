class KeyPressListener {
    constructor(keyCode, callback) {
        let keySafe = true; // tracks whether the key is currently being pressed
        this.keydownFunction = function(event) {
            if(event.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        };
        this.keyupFunction = function(event) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        };
        // bind the functions to key prsses + releases
        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFunction);
    }

    // remove the event listeners bounded to the class fxns
    unbind() {
        document.removeEventListener("keydown", this.keydownFunction);
        document.removeEventListener("keyup", this.keyupFunction);
    }
}