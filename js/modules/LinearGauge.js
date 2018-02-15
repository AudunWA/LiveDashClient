import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class LinearGauge extends Module {
    constructor(area) {
        super( area);
        this.percentage = 0;
    }

    view() {
        return m("div.cell", { style: { "grid-area": this.area } },
            m("div.linear-gauge",
                m("div.gauge-percentage", {style: {width: `${this.percentage}%`}})
            )
        );
    }

    onData(value) {
        this.percentage = value / (MAX_SPEED - MIN_SPEED) * 100;
    }
}