import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class Speedometer extends Module {
    constructor(id, area) {
        super(id, area);
        this.rotation = 0;
    }

    view() {
        return m(".", { id: this.id, class: this.classNames, style: this.style, onmouseenter: () => this.hovering = true, onmouseleave: () => this.hovering = false },
            m(".speedometer",
                m(".pin", {style: {transform: `rotate(${this.rotation}deg)`}})
            ),
            this.editControls()
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