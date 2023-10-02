class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    textMessage(resolve) {
        // edit text
        const text = this.event.text
        .replace("{CASTER}", this.event.caster?.name)
        .replace("{TARGET}", this.event.target?.name)
        .replace("{ACTION}", this.event.action?.name)
        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        })
        message.init(this.battle.element);
    }

    submissionMenu(resolve) {
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            onComplete: submission => {
                // submission - what move to use, who to use it on
                resolve(submission);
            }
        })
        menu.init(this.battle.element);
    }

    async stateChange(resolve) {
        const { caster, target, damage } = this.event;
        // if any combatant is damaged
        if (damage) {
            // modify target to have less hp
            target.update({
                hp: target.hp - damage
            })

            // target will start blinking
            target.pizzaElement.classList.add("battle-damage-blink");
        }
        // wait a bit
        await utils.wait(600);
        // stop blinkin 
        target.pizzaElement.classList.remove("battle-damage-blink");
        resolve();
    }

    animation(resolve) {
        const fxn = BattleAnimations[this.event.animation];
        fxn(this.event, resolve);
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}