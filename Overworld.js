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
            
            // draw lower layer
            this.map.drawLowerImage(this.ctx);

            // draw upper layer
            this.map.drawUpperImage(this.ctx);

            // draw game objects 
            Object.values(this.map.gameObjects).forEach(object =>{
                object.x += 0.02;
                object.sprite.draw(this.ctx);
            })

            // browser will call this fxn whenever a new frame begins
            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.Kitchen);

        // start game loop when browser starts
        this.startGameLoop();
        
        
    }
}

