class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    /* each type of overworld event will have its own method */
    /* each method will include a resolver which is a fxn the 
    method can call to tell the system the event is done */

    // this will kick off one of the instructional mehtods below
    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
    stand(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction, 
            time: this.event.time
        })

        // set up handler to complete wehn the correct person is done walking. then resolve the event
        const completeHandler = e => {
            // make sure it's the person we care about that finsihed the walking
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandingComplete", completeHandler);
    }

    walk(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        // set up handler to complete wehn the correct person is done walking. then resolve the event
        const completeHandler = e => {
            // make sure it's the person we care about that finsihed the walking
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    textMessage(resolve) {
        // make npcs face hero when talking
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            // npc will face opposite dir of hero to face them 
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {
        this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
        resolve();
    }
}