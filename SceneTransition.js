class SceneTransition {
    constructor() {
        this.element = null;
    }

    // creates the div that the fadein + out lives in
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("SceneTransition");
    }

    // starts the fade out + removes the element from the dom after done
    fadeOut() {
        // triggers the animation to go backwards -- from opaque to transparent
        this.element.classList.add("fade-out");
        this.element.addEventListener("animationend", () => {
            this.element.remove();
        }, { once: true })
    }

    // creates the element + starts the fade-in transition
    init(container, callback) {
        // create element + append
        this.createElement();
        container.appendChild(this.element);
        
        // fires callback only once when the animation ends
        // binding will immediately unbind when the event runs
        this.element.addEventListener("animationend", () => {
            callback();
        }, { once: true })
    }
}