class Combatant {
    constructor(config, battle) {
        // iterate through each config key + add them to the class 
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })
        this.battle = battle;
    }

    // hp + xp percent is curr hp divided by max
    get hpPercent() {
        const percent = this.hp / this.maxHp * 100;
        return percent > 0 ? percent : 0;
    }

    get xpPercent() {
        return this.xp / this.maxXp * 100;
    }

    get isActive() {
        return this.battle.activeCombatants[this.team] === this.id;
    }

    createElement() {
        // create the hud element
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team);
        this.hudElement.innerHTML = (`
            <p class="Combatant_name">${this.name}</p>
            <p class="Combatant_level"></p>
            <div class="Combatant_character_crop">
                <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
            </div>
            <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>
            <svg viewBox="0 0 26 2" class="Combatant_xp-container">
                <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
                <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
            </svg>
            <p class="Combatant_status"></p>
        `);

        // create the pizza element
        this.pizzaElement= document.createElement("img");
        this.pizzaElement.classList.add("Pizza");
        this.pizzaElement.setAttribute("src", this.src);
        this.pizzaElement.setAttribute("alt", this.name);
        this.pizzaElement.setAttribute("data-team", this.team);

        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
    }

    update(changes = {}) {
        // update all the incoming fields
        Object.keys(changes).forEach(key => {
            this[key] = changes[key]
        });

        // update active flag to show the correct pizza and hud
        this.hudElement.setAttribute("data-active", this.isActive);
        this.pizzaElement.setAttribute("data-active", this.isActive);

        // update level on screen
        this.hudElement.querySelector(".Combatant_level").innerText = this.level;

        // update hp and xp bar percent fills
        this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`);
        this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`);

        // update status
        const statusElement = this.hudElement.querySelector(".Combatant_status");
        // if the combatant has a status display it
        if (this.status) {
            statusElement.innerText = this.status.type;
            statusElement.style.display = "block";
        } else {
            statusElement.innerText = "";
            statusElement.style.display = "none";
        }
    }

    // get either original or replaced events 
    getReplacedEvents(originalEvents) {
        // if clumsy, then 1/3 chance of caster's action events being replaced 
        if ( this.status?.type === "clumsy" && utils.randomFromArray([true, false, false]) ) {
            return [
                { type: "textMessage", text: `${this.name} flops over!` }
            ]
        }
        // defaults to the original events
        return originalEvents;
    }
    
    // returns all the events that should happen after the caster turn action
    getPostEvents() {
        // handle case with status
        if (this.status?.type === "saucy") {
            return [
                { type: "textMessage", text: "Feelin' saucy :D" },
                { type: "stateChange", recover: 5, onCaster: true },
            ]
        }
        // defaults to empty (usual case)
        return [];
    }

    // downtick turn count for status + remove status for counts that reach 0
    decrementStatus() {
        if (this.status?.expiresIn > 0) {
            this.status.expiresIn -= 1;
            // hold old status for message
            let oldStatus = this.status.type;
            if (this.status.expiresIn === 0) {
                this.update({
                    status: null,
                });
                return {
                    type: "textMessage",
                    text: `Status expired! No longer ${oldStatus} :(`
                }
            }
        }
        return null;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.pizzaElement);
        this.update();
    }

}