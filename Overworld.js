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
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;
            }).forEach(object =>{
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

    /* functions to bind inputs/game events to event handlers */
    // listen for enter key + check for npc dialogue if npc at that pos
    bindActionInput() {
        new KeyPressListener("Enter", () => {
            // ask map if there is a person there to talk to
            this.map.checkForActionCutscene();
        })
    }

    // listen for hero position changes + check for cutscene squares
    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e=> {
            // check if hero position has changed
            if (e.detail.whoId === "hero") {
                // check if there is a cutscene at this square
                this.map.checkForFootstepCutscene();
            }
        })
    }

    // initializes each map for the overworld
    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    /* initializes overall game */
    init() {
        this.startMap(window.OverworldMaps.DemoRoom);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init(); // get bindings on the document

        // start game loop when browser starts
        this.startGameLoop();

        // this.map.startCutscene([
        //     // { type: "textMessage", text: "Hello, this is the first message"}
        //     { type: "changeMap", map: "DemoRoom" }
        // ])
        
        
    }
}

