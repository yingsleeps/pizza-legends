class SubmissionMenu {
    constructor({ caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }

    // for enemy ai to make decisions
    // for simplicity, enemies will randomly pick
    decide() {
        this.onComplete({
            action: Actions[ this.caster.actions[0] ],
            target: this.enemy,
        });
    }

    init(container) {
        this.decide();
    }
}