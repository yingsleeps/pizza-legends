window.BattleAnimations = {
    async spin(event, onComplete) {
        const element = event.caster.pizzaElement;
        const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";

        // add animation to our pizza
        element.classList.add(animationClassName);

        // remove class when animation is fully complete
        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, { once: true });

        // continue battle (move onto hp reduction) around when the pizzas collide
        await utils.wait(100);
        onComplete();
    },
    async glob(event, onComplete) {
        const { caster } = event;
        // create + define the glob
        let div = document.createElement("div");
        div.classList.add("glob-orb");
        div.classList.add(caster.team === "player" ? "battle-glob-right" : "battle-glob-left");
        div.innerHTML = (`
            <svg viewBox="0 0 32 32" width="32" height="32">
                <circle cx="16" cy="16" r="16" fill="${event.color}" />
            </svg>
        `);

        // remove div from dom when animation is complete
        div.addEventListener("animationend", () => {
            div.remove();
        });
        // add div to the dom with the pizzas
        document.querySelector(".Battle").appendChild(div);

        // continue on when glob hits pizza
        await utils.wait(820);
        onComplete();
    }
}