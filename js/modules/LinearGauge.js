import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class LinearGauge extends Module {
    constructor(id, area) {
        super(id, area);
        this.percentage = 0;
        this.value = 0;
    }

    view() {
        return m(".fc", Object.assign({
                id: this.id,
                class: this.classNames,
                style: this.style,
                onmouseenter: () => this.hovering = true,
                onmouseleave: () => this.hovering = false
            }, this.domAttributes),
            m(".linear-gauge",
                m(".gauge-percentage", {style: {width: `${this.percentage}%`}}),
                m("span.gauge-text", this.value.toFixed(1) + "%")
            ),
            m("span.gauge-title", this.channel),
            this.editControls()
        );
    }

    onData(value) {
        this.percentage = value / (MAX_SPEED - MIN_SPEED) * 100;
        this.value = value;
    }

    onClick(event) {
        super.onClick(event);
        this.percentage = Math.random() * 100;
        m.redraw();
    }
}