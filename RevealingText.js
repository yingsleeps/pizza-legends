/* implement typewriter effect for text messages. 
want to implement the behavior of revealing the full text 
when enter is hit */
class RevealingText {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 60;

        this.timeout = null;
        this.isDone = false; // flag for if text is done revealing
    }

    // recursive function to reveal one char after each delay
    revealOneCharacter(list) {
        const next = list.splice(0,1)[0];
        next.span.classList.add("revealed");

        if (list.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealOneCharacter(list);
            }, next.delayAfter)
        } else {
            this.isDone = true;
        }
    }

    // will reveal all the text spans + set the event to done
    warpToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed");
        })
    }

    init() {
        let characters = [];
        this.text.split("").forEach(character => {
            // create each span + add to element in dom
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);

            // add this span to our internal state array, so we can reference
            // each span later
            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed,
            })
        });

        this.revealOneCharacter(characters);
    }
} 
