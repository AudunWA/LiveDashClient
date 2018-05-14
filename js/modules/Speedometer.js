import {Module} from "./Module.js";

/**
 * Speedometer module used in early prototypes
 * @deprecated
 */
export class Speedometer extends Module {
    /**
     * @inheritDoc
     */
    constructor(id, channel, area) {
        super(id, channel, area);
        this.rotation = 0;
    }

    /**
     * @inheritDoc
     */
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

    /**
     * Calculates the rotation of the speedometer pin
     * @private
     * @param {number} speed The current speed (data value)
     * @returns {number} The rotation the pin should have, in degrees
     */
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