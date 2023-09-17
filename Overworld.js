/* top level; will keep track of a lot of the state and 
send that state down to the sub-components */

class Overworld {
    // passing in an object
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init() {
        /* for html, to draw pixel data from an image onto a 
        canvas context, u need to first load the img onto the 
        browser in memory */
        /* this img does not get injected into the DOM, we just
        create it + after it gets downloaded, then we can copy 
        the pixels onto the canvas */

        const image = new Image();
        // call back that happens when the img loads
        image.onload = () => {
            // when img loads, draw it to the context
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = "/images/maps/DemoLower.png";

        // place some game objects
        const hero = new GameObject({
            x: 5,
            y: 6,
        })

        const npc1 = new GameObject({
            x: 7,
            y: 9,
            src: "/images/characters/people/npc1.png",
        })
        
        setTimeout(() => {
             // draw the game objs
            hero.sprite.draw(this.ctx);
            npc1.sprite.draw(this.ctx);
        }, 200)
    }
}

