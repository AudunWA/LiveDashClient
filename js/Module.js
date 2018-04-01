import classnames from "classnames";
import Application from "./Application.js";

export class Module {
    constructor(id, area) {
        this.id = id;
        this.style = { "grid-area": area };
    }

    get classNames() {
        return classnames(
            "cell",
            {
                edit: Application.layout.editMode
            }
        );
    }

    get area() {
        return this.style["grid-area"];
    }

    set area(newArea) {
        this.style["grid-area"] = newArea;
    }

    view(node) {

    }

    onData(value) {

    }
}