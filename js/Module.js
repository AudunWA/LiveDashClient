export class Module {
    constructor(id, area) {
        this.id = id;
        this.style = { "grid-area": area };
        this.classList = [];
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