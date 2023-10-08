class SubmissionMenu {
    constructor({ caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }

    // for enemy ai to make decisions
    decide() {
        // TODO: make move selection random
        this.menuSubmit(Actions[this.caster.actions[0]]);
    }

    // when players make actions with submission menu
    menuSubmit(action, instanceId=null) {
        // clean up code for when menu disappears
        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
        });
    }

    // get pages of the different options menu can show
    getPages() {
        // back button for menu 
        const backOption = {
            label: "Go back",
            description: "Return to the previous page.",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root);
            }
        }

        return {
            root: [
               {
                label: "Attack",
                description: "Choose an attack.",
                handler: () => {
                    // go to attacks
                    this.keyboardMenu.setOptions( this.getPages().attacks );
                }
               }, 
               {
                label: "Items",
                description: "Choose an item.",
                handler: () => {
                    // go to items inventory
                    this.keyboardMenu.setOptions( this.getPages().items );
                }
               },
               {
                label: "Swap",
                description: "Change to another pizza.",
                handler: () => {
                    // see the pizza options
                    console.log("go to the pizza page!!")
                }
               }
            ],
            attacks: [
                ...this.caster.actions.map(key => {
                    const action = Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);
                        } 
                    }
                }),
               backOption,
            ],
            items: [
                // items will go here
                backOption
            ]
        }
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(this.getPages().root);
    }

    init(container) {
        // if player is decideding, show menu. otherwise, ai decides randomly
        if (this.caster.isPlayerControlled) {
            this.showMenu(container);
        } else {
            this.decide();
        }
    }
}