import {Module} from "../Module.js";
import Application from "../Application.js";
import classNames from "../libraries/classnames.js";

export class EmptyModule extends Module {
    constructor(id, area) {
        super(id, area);
        this.hovering = false;
    }
    view() {
        return m(".empty", Object.assign({
            id: this.id,
            class: this.classNames,
            style: this.style,
            onmouseenter: (event) => this.onMouseEnter(event),
            onmouseleave: (event) => this.onMouseLeave(event),
        }, this.domAttributes),
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