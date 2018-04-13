import classNames from "./libraries/classnames.js";
import Application from "./Application.js";

export class Module {
    constructor(id, area) {
        this.id = id;
        this.style = { "grid-area": area };
        this.preview = false;
    }

    get classNames() {
        return classNames(
            {
                edit: Application.layout.editMode && !this.preview
            }
        );
    }

    get area() {
        return this.style["grid-area"];
    }

    set area(newArea) {
        this.style["grid-area"] = newArea;
    }

    editControls() {
        return Application.layout.editMode && this.hovering ?
            m(".tooltip",
                // m("button", { onclick: e => this.openEditModal(e) } ,"Edit"),
                m("button", { onclick: e => this.deleteMe(e) } ,"Remove")
            )
            : null;
    }

    deleteMe(e) {
        Application.layout.deleteModule(this.id);
    }

    openEditModal(e) {

    }

    view(node) {

    }

    onData(value) {

    }
}