class KeyboardMenu {
    constructor() {
        this.options = []; // set by updater method
        this.up = null;
        this.down = null;
        this.prevFocus = null;
    }

    setOptions(options) {
        // create the buttons in the menu
        this.options = options;
        this.element.innerHTML = this.options.map((option, index) => {
            // if option is disabled, add disabled attr
            const disabledAttr = option.disabled ? "disabled" : "";
            return (`
                <div class="option">
                    <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
                        ${option.label}
                    </button>
                    <span class="right">${option.right ? option.right() : ""}</span>
                </div> 
            `)
        }).join("");

        // add listeners for the buttons
        this.element.querySelectorAll("button").forEach(button => {
            // when button is clicked 
            button.addEventListener("click", () => {
                // figure out which button it was
                const chosenOption = this.options[ Number(button.dataset.button) ];
                // run the handler associated with it
                chosenOption.handler();
            });
            // when mouse over button, focus
            button.addEventListener("mouseenter", () => {
                button.focus();
            });
            // when button focuses, update internal state
            button.addEventListener("focus", () => {
                this.prevFocus = button;
                this.descriptionElementText.innerText = button.dataset.description;
            });
        });

        // focus on the first non-disabled button after the menu loads
        setTimeout(() => {
            this.element.querySelector("button[data-button]:not([disabled])").focus()
        }, 10);

    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("KeyboardMenu");

        // description box element
        this.descriptionElement = document.createElement("div");
        this.descriptionElement.classList.add("DescriptionBox");
        this.descriptionElement.innerHTML = (`<p>so info</p>`);
        // save ref to that paragraph bc we update it a lot
        this.descriptionElementText = this.descriptionElement.querySelector("p");
    }

    // clean up key listeners + menu elems when done with menu
    end() {
        // remove elems from the dom
        this.element.remove();
        this.descriptionElement.remove();
        // unbind the key listeners
        this.up.unbind();
        this.down.unbind();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.descriptionElement);
        container.appendChild(this.element);

        // add arrow bindings to use arrow keys to select options
        this.up = new KeyPressListener("ArrowUp", () => {
            const current = Number( this.prevFocus.getAttribute("data-button") );
            const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(elem => {
                return elem.dataset.button < current && !elem.disabled;
            });
            prevButton?.focus();
        })
        this.down = new KeyPressListener("ArrowDown", () => {
            const current = Number( this.prevFocus.getAttribute("data-button") );
            // out of all buttons, find the next non-disabled one
            const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(elem => {
                return elem.dataset.button > current && !elem.disabled;
            });
            nextButton?.focus();
        })
    }
}