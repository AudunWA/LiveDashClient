import {Module} from "./Module.js";
import Application from "../Application.js";

export class EditButton extends Module {
    constructor(id, area) {
        super(id, null, area);
        this.text = "Edit layout";
    }
    view() {
        return m(".top-buttons", {id: this.id, style: this.style},
            m("button", { onclick: (event) => this.onClick(event)}, this.text),
            m("button", { onclick: (event) => this.resetLayout(event)}, "Reset layout")
        );
    }
    onClick(event) {
        Application.layout.toggleEditMode();
        this.__proto__.text = Application.layout.editMode ? "Finish editing" : "Edit layout";
    }

    resetLayout(event) {
        Application.openWelcomeModal();
    }
}