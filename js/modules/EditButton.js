import {Module} from "../Module.js";
import {Application} from "../Application.js";

export class EditButton extends Module {
    constructor(id, area) {
        super(id, area);
    }
    view() {
        return m(".cell", {id: this.id, style: this.style},
            m("button", { onclick: this.onClick}, "Edit layout")
        );
    }
    onClick(event) {
        Application.layout.toggleEditMode();
    }
}