import {Module} from "../Module.js";

export class LinearGauge extends Module {
    constructor(id, channel, area) {
        super(id, channel, area);
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
                m("span.gauge-text", this.value.toFixed(1) + " " + this.channel.unit)
            ),
            m("span.gauge-title", this.channelDisplayName),
            this.editControls()
        );
    }

    onData(value) {
        super.onData(value);

        this.percentage = value / (this.maxValue - this.minValue) * 100;
        this.value = value;
    }

    onClick(event) {
        super.onClick(event);
        this.percentage = Math.random() * 100;
        m.redraw();
    }
}