import {Module} from "../Module.js";

export class EmptyModule extends Module {
    constructor(id, area) {
        super(id, area);
    }
    view() {
        return m("div.empty", {id: this.id, style: this.style});
    }
}