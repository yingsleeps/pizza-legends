/* abstraction of the concept of people + items on screen */
class GameObject {
    // passing in an object
    constructor(config) {
        this.id = null; // identifier to puppet game objs
        this.isMounted = false;
        // pass in position of object or default
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";

        // pass in appearance 
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/hero.png",

        });

        // hold behavior loop array passed in or leave as empty arr
        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0; // keep track of which behavior we are on

        // hold talking array passed in or leave as empty arr
        this.talking = config.talking || [];
    }

    update() {

    }

    /* mounts objs to the map, blocking off the space they occupy */
    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // if we have a behavior, kick off after a short delay
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
    }

    /* npcs run their idle behavior loops */ 
    async doBehaviorEvent(map) {
        // don't do anything if there is a cutscene playing or if there isn't a config to do anything 
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        // setting up event with relevant info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex]; // pull out the event we are working on
        eventConfig.who = this.id;
        
        // create an event instance out of our next event config
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init(); // wait for this event to finish before starting the next

        // setting up the next event to fire
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        // do the it again! (onto the next event)
        this.doBehaviorEvent(map)

    }
}