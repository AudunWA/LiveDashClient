import {Module} from "./Module.js";

export class Speedometer extends Module {
    constructor(id, channel, area) {
        super(id, channel, area);
        this.rotation = 0;
    }

    view() {
        return m(".", Object.assign({
            id: this.id,
            class: this.classNames,
            style: this.style}, this.staticDomAttributes),
        m(".speedometer",
            m(".pin", {style: {transform: `rotate(${this.rotation}deg)`}})
        ),
        this.editControls()
        );
    }

    calculateRotation(speed) {
        let speedRange = this.maxValue - this.minValue;
        let percentage = speed / speedRange;
        return percentage * 180 - 90;
    }


    onData(value) {
        super.onData(value);

        this.rotation = this.calculateRotation(value);
    }
}