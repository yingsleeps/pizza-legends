/* top level; will keep track of a lot of the state and 
send that state down to the sub-components */

class Overworld {
    // passing in an object
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        /* not an infinite loop! fxn just fires every frame */
        const step = () => {

            // clean up the canvas before drawing
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // establish obj the camera should follow
            const cameraPerson = this.map.gameObjects.hero;

            // update all objects before drawing 
            Object.values(this.map.gameObjects).forEach(object =>{
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })

            // draw lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            // draw game objects 
            Object.values(this.map.gameObjects).forEach(object =>{
                object.sprite.draw(this.ctx, cameraPerson);
            })

            // draw upper layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            // browser will call this fxn whenever a new frame begins
            setTimeout(() => {

                requestAnimationFrame(() => {
                    step();
                })
            }, 1000 / 80);
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.map.mountObjects();

        this.directionInput = new DirectionInput();
        this.directionInput.init(); // get bindings on the document
        this.directionInput.direction; 

        // start game loop when browser starts
        this.startGameLoop();
        
        
    }
}

