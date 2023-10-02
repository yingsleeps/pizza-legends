class TurnCycle {
    constructor({ battle, onNewEvent }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.currentTeam = "player"; // or enemy
    }

    async turn() {
        // get caster - ref to combatant class that is the caster of this turn
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];
        // get enemy
        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];

        // get submission from caster
        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy,
        });

        // get all resulting events that will happen after the submitted action
        const resultingEvents = submission.action.success;
        // iterate through each event + await result of each
        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        // move onto next turn -- change current team
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
    }   

    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: "the battle is starting!"
        });

        // start the first turn
        this.turn();
    }
}