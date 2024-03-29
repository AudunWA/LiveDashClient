import {Module} from "./Module.js";

export class Gauge {
    constructor(minValue, maxValue, canId) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.canId = canId;
        this.percentage = 0;
    }

    onData(value) {
        super.onData(value);

        this.percentage = value / (this.maxValue - this.minValue) * 100;
    }
}

/**
 * An unused module which groups together 2 bar gauges
 */
export class LinearGaugeSet extends Module {
    constructor(id, area, gauges) {
        super(id, area);
        this.gauges = gauges;
    }

    view() {
        return m(".flex-column", Object.assign({
            id: this.id,
            class: this.classNames,
            style: this.style
        }, this.staticDomAttributes),
        this.gauges.map((gauge) => m(".linear-gauge",
            m(".gauge-percentage", {style: {width: `${gauge.percentage}%`}})
        )),
        this.editControls()
        );
    }

    subscribe(dataProvider) {
        // this.gauges.forEach((gauge) => {
        //     dataProvider.subscribeToChannel(gauge, gauge.canId);
        // });
    }
}