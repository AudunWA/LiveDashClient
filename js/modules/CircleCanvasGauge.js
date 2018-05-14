import {Module} from "./Module.js";
import {getRootCssProperty, clamp, lerp} from "../Util.js";

/**
 * A canvas-based circular gauge module
 */
export class CircleCanvasGauge extends Module {
    constructor(id, channel, area, thickness) {
        super(id, channel, area);
        this.value = 0;
        this.percentage = 0;
        this.goalPercentage = 0;
        this.thickness = thickness;
        this.canvas = null;
        this.context = null;
        this.backgroundStyle = getRootCssProperty("--module-secondary-color");
        this.fillStyle = getRootCssProperty("--module-primary-color");
        this.textStyle = getRootCssProperty("--module-text-color");
    }

    view() {
        return m(".",
            Object.assign(
                {
                    id: this.id,
                    class: this.classNames,
                    style: this.style
                }, this.staticDomAttributes),
            m(".flex-center",
                m("canvas.canvas-gauge", {id: this.canvasId + "-static"}),
                m("canvas.canvas-gauge", {id: this.canvasId})
            ),
            this.editControls()
        );
    }

    /**
     * A Mithril lifecycle method which is called after the view has been rendered
     */
    oncreate() {
        // We have to use this.__proto__ to access the class instance, as this === vnode.state in lifecycle methods
        this.__proto__.canvas = document.getElementById(this.canvasId);
        this.__proto__.context = this.canvas.getContext("2d");
        this.__proto__.staticCanvas = document.getElementById(this.canvasId + "-static");
        this.__proto__.staticContext = this.staticCanvas.getContext("2d");
        this.animate();
    }

    /**
     * The DOM ID of the main canvas
     */
    get canvasId() {
        return "canvas-gauge-" + this.id;
    }

    onData(value) {
        super.onData(value);

        this.goalPercentage = clamp(value / (this.maxValue - this.minValue), 0, 1);
        this.value = value;
        this.animate();
    }

    /**
     * Ensures that the canvas is scaled correctly
     */
    resize() {
        if (this.canvas.width === this.canvas.offsetWidth && this.canvas.height === this.canvas.clientHeight) {
            // No resize needed
            return;
        }
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.staticCanvas.width = this.staticCanvas.offsetWidth;
        this.staticCanvas.height = this.staticCanvas.clientHeight;
        this.drawStatic();
    }

    /**
     * Draws the current percentage of the gauge, and queues another draw if needed for smooth animation
     */
    animate() {
        if (!this.canvas) {
            return;
        }

        this.resize();

        this.percentage = lerp(this.percentage, this.goalPercentage, 0.1);

        let centerX = this.canvas.width / 2;
        let centerY = 2 / 5 * this.canvas.height;
        let factor = Math.min(this.canvas.offsetHeight, this.canvas.offsetWidth);
        let radius = factor * 0.4;
        let endAngle = 2 * Math.PI * this.percentage - Math.PI / 2;

        this.context.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI / 2, endAngle, false);
        this.context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle, -Math.PI / 2, true);
        this.context.closePath();
        this.context.fillStyle = this.fillStyle;
        this.context.fill();

        this.context.textAlign = "center";
        const fontSize = clamp(factor * 0.1, 10, 50);
        this.context.font = fontSize + "px Arial";
        this.context.fillStyle = this.textStyle;
        this.context.fillText(this.value + " " + this.channel.unit, centerX, centerY * 1.1);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.001) {
            requestAnimationFrame(() => this.animate());
        }
    }

    get channel() {
        return super.channel;
    }

    set channel(value) {
        super.channel = value;

        if (this.staticContext) {
            this.drawStatic();
        }
    }

    /**
     * Draws the static background on the background canvas.
     * Should only be called when necessary, to maintain good performance
     */
    drawStatic() {
        let centerX = this.staticCanvas.width / 2;
        let centerY = 2 / 5 * this.staticCanvas.height;
        let factor = Math.min(this.staticCanvas.offsetHeight, this.staticCanvas.offsetWidth);
        let radius = factor * 0.4;

        this.staticContext.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
        this.staticContext.beginPath();
        this.staticContext.arc(centerX, centerY, radius, -Math.PI / 2, 3 / 2 * Math.PI, false);
        this.staticContext.arc(centerX, centerY, radius * (1 - this.thickness), 3 / 2 * Math.PI, -Math.PI / 2, true);
        this.staticContext.closePath();
        this.staticContext.fillStyle = this.backgroundStyle;
        this.staticContext.fill();

        this.staticContext.textAlign = "center";
        const fontSize = clamp(factor * 0.1, 10, 50);
        this.staticContext.font = fontSize + "px Arial";
        this.staticContext.fillStyle = this.textStyle;
        this.staticContext.fillText(this.channelDisplayName, centerX, centerY * 2.3);
    }
}