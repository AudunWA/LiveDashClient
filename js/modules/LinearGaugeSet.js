import {Module} from "../Module.js";

export class Gauge {
    constructor(minValue, maxValue, canId) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.canId = canId;
        this.percentage = 0;
    }

    onData(value) {
        this.percentage = value / (this.maxValue - this.minValue) * 100;
    }
}

export class LinearGaugeSet extends Module {
    constructor(id, area, gauges) {
        super(id, area);
        this.gauges = gauges;
    }

    view() {
        return m(".flex-column", { id: this.id, class: this.classNames, style: this.style },
            this.gauges.map((gauge) => m(".linear-gauge",
                m(".gauge-percentage", {style: {width: `${gauge.percentage}%`}})
            ))
        );
    }

    subscribe(dataProvider) {
        this.gauges.forEach((gauge) => {
            dataProvider.subscribeToChannel(gauge.canId, (value) => gauge.onData(value));
        });
    }
}