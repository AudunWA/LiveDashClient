import {Module} from "./Module.js";

/**
 * A linear gauge/percentage bar module
 */
export class LinearGauge extends Module {
    /**
     * @inheritDoc
     */
    constructor(id, channel, area) {
        super(id, channel, area);
        this.percentage = 0;
        this.value = 0;
    }

    /**
     * @inheritDoc
     */
    view() {
        return m(".fc",
            Object.assign({
                id: this.id,
                class: this.classNames,
                style: this.style
            }, this.staticDomAttributes),
            m(".linear-gauge",
                m(".gauge-percentage", {style: {width: `${this.percentage}%`}}),
                m("span.gauge-text", this.value.toFixed(1) + " " + this.channel.unit)
            ),
            m("span.gauge-title", this.channelDisplayName),
            this.editControls()
        );
    }

    /**
     * @inheritDoc
     */
    onData(value) {
        super.onData(value);

        this.percentage = value / (this.maxValue - this.minValue) * 100;
        this.value = value;
    }
}