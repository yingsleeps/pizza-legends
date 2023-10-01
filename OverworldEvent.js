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

    // event for game objects to stand + face a dir for a period of time
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

    // event for game objs walking, resolve event when done walking
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

    // event to show a text message
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

    // event to change map
    // fire change  map betweeen the overworld fades
    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        // create the scene transition element + add it to the game container
        sceneTransition.init(document.querySelector(".game-container"), () => {
            // bring in the new map after the fade in + resolve the event
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
            resolve();

            // start the fade out to reveal the new map
            sceneTransition.fadeOut();
        });
    }

    // event for battles
    battle(resolve) {
        const battle = new Battle({
          onComplete: () => {
            resolve();
          }
        })
        battle.init(document.querySelector(".game-container"));
      }
} 