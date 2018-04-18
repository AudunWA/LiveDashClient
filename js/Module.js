import classNames from "./libraries/classnames.js";
import Application from "./Application.js";

export class Module {
    constructor(id, area) {
        this.id = id;
        this.style = { "grid-area": area };
        this.preview = false;
        this.domAttributes = {
            onclick: event => this.onClick(event)
        };
    }

    onClick(event) {
        if(this.preview) {
            Application.container.addModal.selectModule(this);
        }
    }

    get classNames() {
        return classNames(
            "cell",
            {
                //"module-preview": this.preview,
                //cell: !this.preview,
                edit: Application.layout.editMode && !this.preview,
                selected: this.selected
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
        return !this.preview && Application.layout.editMode && this.hovering ?
            m(".tooltip",
                m("button", { onclick: e => this.openEditModal(e) } ,"Edit"),
                m("button", { onclick: e => this.deleteMe(e) } ,"Remove")
            )
            : null;
    }

    deleteMe(e) {
        Application.layout.deleteModule(this.id);
    }

    openEditModal(e) {
        Application.openEditModal(this);
    }

    view(node) {

    }

    onData(value) {

    }
}