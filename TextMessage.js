class TextMessage {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null; 
    }

    /* pattern for UI components: each will have this createElement 
    method which will create a div + populate it with the details */
    // this creates the text msg element
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
            <p class="TextMessage_p"></p>
            <button class="TextMessage_button">Next</button>
        `)

        // init the typewriter effect
        this.revealingText = new RevealingText({
            text: this.text,
            element: this.element.querySelector(".TextMessage_p"),
        });

        this.element.querySelector("button").addEventListener("click", () => {
            // close the text message
            this.done();
        });

        this.actionListner = new KeyPressListener("Enter", () => {
            this.done();
        });
    }

    done() {
        // if enter is hit after text is done revealing, end the event
        if (this.revealingText.isDone) {
            this.element.remove();
            this.actionListner.unbind(); // unbind the enter listener to done method
            // resolves the event so actions in the cutscene can continue
            this.onComplete();
        } 
        // if enter is hit before text is done revealing, skip to end 
        else {
            this.revealingText.warpToDone();
        }
    }

    /* takes in a container. when init is called, the class will 
    create the element + append it to the container */
    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }
}