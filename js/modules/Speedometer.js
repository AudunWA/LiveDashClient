import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class Speedometer extends Module {
    constructor(id, area) {
        super(id, area);
        this.rotation = 0;
    }

    view() {
        return m("div.cell[draggable]", { id: this.id, style: this.style },
            m("div.speedometer",
                m("div.pin", {style: {transform: `rotate(${this.rotation}deg)`}})
            )
        );
    }

    calculateRotation(speed) {
        let speedRange = MAX_SPEED - MIN_SPEED;
        let percentage = speed / speedRange;
        return percentage * 180 - 90;
    }


    onData(value) {
        this.rotation = this.calculateRotation(value);
    }
}