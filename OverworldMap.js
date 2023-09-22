class OverworldMap {
    constructor(config) {
        // reference back to the overworld
        this.overworld = null;

        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc; 

        this.isCutscenePlaying = false;
    }

    /* functions for drawing */ 
    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage, 
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        )
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }
    
    /* function to add objects to the map */
    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            
            let object = this.gameObjects[key];
            object.id = key;

            /* TODO: add logic to determine if obj should actually mount */

            object.mount(this);
        })
    }

    /* functions for cutscene event behaviors */
    // start the cutscene + reset npc behaviors when done
    async startCutscene(events) {
        this.isCutscenePlaying = true;

        /* start a loop of async events + await each one */
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                map: this,
                event: events[i],
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        // reset npcs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
    }

    // check for cutscene at hero's position + play npc text cutscene if one
    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoord = utils.nextPosition(hero.x, hero.y, hero.direction);
        // look thru game objs to see if any of them are at the next coord
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoord.x},${nextCoord.y}`
        });
        // check if obj has things to say
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    // check for cutscene at the hero's position + play footstep cutscene if one  
    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events); 
        }
    }

    /* functions for game objs to block off the space they are on */
    // run when objs enter the map
    addWall(x,y) {
        this.walls[`${x},${y}`] = true;
    }

    // run when objs leave the map
    removeWall(x,y) {
        delete this.walls[`${x},${y}`];
    }

    // run when objs move around
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }
}

/* configuration data for maps */
window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "/images/maps/DemoLower.png",
        upperSrc: "images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "/images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800 },
                    { type: "stand", direction: "up", time: 800  },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300  },
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "hello ning...", faceHero: "npcA"},
                            { type: "textMessage", text: "fighting"},
                        ]
                    },
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "/images/characters/people/npc2.png",
                // idle behavior loop -- happens when nothing global is happening (like player cut scene)
                // behaviorLoop: [
                //     { type: "walk", direction: "left" }, // each behavior event will look like this
                //     { type: "stand", direction: "up", time: 800 },
                //     { type: "walk", direction: "up" },
                //     { type: "walk", direction: "right" },
                //     { type: "walk", direction: "down" },
                // ]
            }),
        },
        walls: {
            // dynamic key - don't know what the value is yet 
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7,4)]  : [
                {
                    events: [
                        { who: "npcB", type: "walk", direction: "left" },
                        { who: "npcB", type: "stand", direction: "up", time: 500 },
                        { type: "textMessage", text: "hey! get out of there!" },
                        { who: "npcB", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "left" },
                    ]
                }
            ],
            [utils.asGridCoord(5,10)] : [
                {
                    events: [
                        { type: "changeMap", map: "Kitchen" }
                    ]
                }
            ]
        }
    },  
    Kitchen: {
        lowerSrc: "/images/maps/KitchenLower.png",
        upperSrc: "images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            }),
            npcC: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "/images/characters/people/npc3.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "you made it to the kitchen!", faceHero: "npcC" }
                        ]
                    }
                ]
            }),
        }
    },
}