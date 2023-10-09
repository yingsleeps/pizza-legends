/* data store for all the actions pizzas can take */
window.Actions = {
    damage1: {
        name: "Whomp!",
        description: "Pillowy punch of dough.",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}." },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 10 },
        ]
    },
    saucyStatus: {
        name: "Tomato Squeeze",
        description: "Applies the saucy status with a refreshing squeeze.",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}." },
            { type: "stateChange", status: { type: "saucy", expiresIn: 3 } },
        ]
    },
    clumsyStatus: {
        name: "Olive Oil",
        description: "Applies the clumsy status with a slippery mess.",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}." },
            { type: "animation", animation: "glob", color: "#dafd2a" },
            { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
            { type: "textMessage", text: "{TARGET} is slipping and sliding." },
        ]
    },
    // items
    item_recoverStatus: {
        name: "Heating Lamp",
        description: "Feeling warm and toasty!",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}." },
            { type: "stateChange", status: null },
            { type: "textMessage", text: "Feeling refreshed!" },
        ]
    }
}