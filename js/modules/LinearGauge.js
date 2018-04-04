import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class LinearGauge extends Module {
    constructor(id, area) {
        super(id, area);
        this.percentage = 0;
    }

    view() {
        return m(".", { id: this.id, class: this.classNames, style: this.style, onmouseenter: () => this.hovering = true, onmouseleave: () => this.hovering = false },
            m(".linear-gauge",
                m(".gauge-percentage", {style: {width: `${this.percentage}%`}})
            ),
            this.editControls()
        );
    }

    onData(value) {
        this.percentage = value / (MAX_SPEED - MIN_SPEED) * 100;
    }
}