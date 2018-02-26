import {Module} from "../Module.js";

export class EmptyModule extends Module {
    constructor(id, area) {
        super(id, area);
    }
    view() {
        return m("div.cell", {id: this.id, style: {"grid-area": this.area}});
    }
}