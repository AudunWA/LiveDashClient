import Application from "./Application.js";
import classNames from "./libraries/classnames.js";

/**
 * An modal which opens the first time an user uses the application, or when it's requested manually.
 * Lets an user choose a preset for the module layout
 */
export class WelcomeModal {
    constructor() {
        this.selectedPreset = null;
        this.isOpen = false;
        this.presets = Application.layout.layoutPresets;
    }

    view() {
        return this.isOpen ? m(".modal#add-modal", {
            style: {display: this.isOpen ? "flex" : "none"},
            onclick: (e) => this.closeModal(e, true)
        },
        m(".modal-content",
            m(".modal-header",
                m("span.close", {onclick: (e) => this.closeModal(e, false)}, m.trust("&times;")),
                m("h2", "Choose a preset")
            ),
            m(".modal-body.welcome-body",
                this.presets.map(preset => m(".preset",
                    {
                        id: preset.id,
                        class: classNames({
                            selected: preset.selected
                        }),
                        onclick: (e) => this.selectPreset(e)
                    },
                    m("h2", preset.name),
                    m("p",  preset.description)
                ))
            ),
            m(".modal-footer.top-buttons",
                m(".top-buttons",
                    m("button", {onclick: e => this.applyPreset(e)}, "OK"),
                )
            )
        )
        ) : null;
    }

    closeModal(event, checkId) {
        if (checkId && event.target.id !== "add-modal")
            return;

        this.__proto__.isOpen = false;
        localStorage.setItem("hasBeenUsedBefore", "true");
    }

    selectPreset(event) {
        // Get the correct element when user has clicked on a child of it
        let element = event.target;
        while(element.parentElement && !element.id.startsWith("preset-")) {
            element = element.parentElement;
        }

        const preset = this.presets.find(preset => preset.id === element.id);
        if (this.__proto__.selectedPreset) {
            this.__proto__.selectedPreset.selected = false;
        }

        this.__proto__.selectedPreset = preset;
        this.__proto__.selectedPreset.selected = true;
    }

    applyPreset(event) {
        if (!this.__proto__.selectedPreset)
            return;

        Application.layout.applyLayout(this.selectedPreset);
        this.__proto__.isOpen = false;
        this.__proto__.selectedPreset.selected = false;
        this.__proto__.selectedPreset = null;
        localStorage.setItem("hasBeenUsedBefore", "true");
    }
}