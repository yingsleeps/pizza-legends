/* data store for all the actions pizzas can take */
window.Actions = {
    damage1: {
        name: "Whomp!",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 10 },
        ]
    }
}