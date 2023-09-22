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
            <p class="TextMessage_p">${this.text}</p>
            <button class="TextMessage_button">Next</button>
        `)

        this.element.querySelector("button").addEventListener("click", () => {
            // close the text message
            this.done();
        });

        this.actionListner = new KeyPressListener("Enter", () => {
            this.actionListner.unbind();
            this.done();
        });
    }

    done() {
        this.element.remove();
        // resolves the event so actions in the cutscene can continue
        this.onComplete();
    }

    /* takes in a container. when init is called, the class will 
    create the element + append it to the container */
    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}