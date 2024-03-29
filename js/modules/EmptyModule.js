import {Module} from "./Module.js";
import Application from "../Application.js";
import classNames from "../libraries/classnames.js";

/**
 * A dummy/placeholder module which is placed in the back of each cell.
 * These are needed for the interaction system
 */
export class EmptyModule extends Module {
    constructor(id, area) {
        super(id, null, area);
        this.hovering = false;
    }
    view() {
        return m(".empty", Object.assign({
            id: this.id,
            class: this.classNames,
            style: this.style
        }, this.staticDomAttributes),
        this.hovering && Application.layout.editMode ? m("a", "+") : null);
    }

    get classNames() {
        return classNames({"edit-empty": Application.layout.editMode});
    }

    onClick(event) {
        super.onClick(event);
        if (Application.layout.editMode) {
            Application.openAddModal(this.area);
        }
    }

    onMouseEnter(event) {
        this.hovering = true;
    }

    onMouseLeave(event) {
        this.hovering = false;
    }
}