/* hosts random useful functions */
const utils = {
    /* functions for movement calculation + direction */
    // does grid calculations for us
    withGrid(n) {
        return n * 16;
    },
    // returns the current grid coord as string
    asGridCoord(x,y) {
        return `${x*16},${y*16}`
    },
    // returns next position based on movement input
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = 16;
        if (direction === "left") {
            x -= size;
        } else if (direction === "right") {
            x += size;
        } else if (direction === "up") {
            y -= size;
        } else if (direction === "down") {
            y += size;
        }
        return {x,y};
    },
    oppositeDirection(direction) {
        if (direction === "left") { return "right" }
        if (direction === "right") { return "left" }
        if (direction === "up") { return "down" }
        return "up"
    },

    /* function to create custom events */ 
    emitEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    },

    /* pacing function */
    wait(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    },

    /* generate random */
    randomFromArray(array) {
        return array[ Math.floor(Math.random()*array.length) ]
    }
}