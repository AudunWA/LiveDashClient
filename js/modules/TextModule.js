import {Module} from "../Module.js";

export class TextModule extends Module {
    constructor(id, area) {
        super(id, area);
        this.text = "";
    }
    view() {
        return m(".", {id: this.id, class: this.classNames, style: this.style}, this.text);
    }

    onData(value) {
        const date = new Date(parseInt(value) * 1000);
        this.text = value + "\n" + date.getHours() + ":"
            + date.getMinutes() + ":"
            + date.getSeconds();
    }
}