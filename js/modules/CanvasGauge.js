import {Module} from "./Module.js";
import {getRootCssProperty, clamp, lerp} from "../Util.js";

/**
 * A canvas-based gauge module
 */
export class CanvasGauge extends Module {
    /**
     * Initializes a new gauge
     * @param {string} id The DOM ID of the module
     * @param {object} channel The data channel which the module should subscribe to
     * @param {string} area The CSS grid-area which the module should reside in
     * @param {number} arcSize The arc size, in radians, that the gauge should cover. Should be in the range <0,2pi]
     * @param {number} thickness The thickness of the gauge. Should be in the range [0, 1]
     */
    constructor(id, channel, area, arcSize, thickness) {
        super(id, channel, area);
        this.value = 0;
        this.percentage = 0;
        this.goalPercentage = 0;
        this.arcSize = arcSize;
        this.thickness = thickness;
        this.canvas = null;
        this.context = null;
        this.backgroundStyle = getRootCssProperty("--module-secondary-color");
        this.fillStyle = getRootCssProperty("--module-primary-color");
        this.textStyle = getRootCssProperty("--module-text-color");
    }

    /**
     * @inheritDoc
     */
    view() {
        return m("div.no-pad", Object.assign({id: this.id, class: this.classNames, style: this.style}, this.staticDomAttributes),
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

        if(this.value === value)
            return;

        this.goalPercentage = clamp(value / (this.maxValue - this.minValue), 0, 1);
        this.value = value;
        this.animate();
    }

    /**
     * Ensures that the canvas is scaled correctly
     */
    resize() {
        if(this.canvas.width === this.canvas.offsetWidth && this.canvas.height === this.canvas.clientHeight) {
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
        if(!this.canvas) {
            return;
        }

        this.resize();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.percentage = lerp(this.percentage, this.goalPercentage, 0.1);

        let radiusFactor = Math.min(this.canvas.height * 0.8, (this.canvas.width / 2) * 0.9);
        let radius = radiusFactor;
        let centerX = 1/2 * this.canvas.width;
        let centerY = 0.5 *  this.canvas.height + radius / 2;
        let factor = Math.min(this.canvas.height, this.canvas.width);
        let endAngle = (Math.PI - this.arcSize * 2) * this.percentage - (Math.PI - this.arcSize);

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI + this.arcSize, endAngle, false);
        this.context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle, -Math.PI + this.arcSize, true);
        this.context.closePath();
        this.context.fillStyle = this.fillStyle;
        this.context.fill();

        this.context.textAlign="center";
        const fontSize = clamp(factor * 0.1, 12, 50);
        this.context.font = fontSize + "px Arial";
        this.context.fillStyle = this.textStyle;
        this.context.fillText(this.value + " " + this.channel.unit, centerX, centerY - radius * 0.25);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.005) {
            requestAnimationFrame(() => this.animate());
        }
    }

    get channel() {
        return super.channel;
    }

    set channel(value) {
        super.channel = value;

        if(this.staticContext) {
            this.drawStatic();
        }
    }

    /**
     * Draws the static background on the background canvas.
     * Should only be called when necessary, to maintain good performance
     */
    drawStatic() {
        let radiusFactor = Math.min(this.canvas.height * 0.8, (this.canvas.width / 2) * 0.9);
        let radius = radiusFactor;
        let centerX = 1/2 * this.canvas.width;
        let centerY = 0.5 *  this.canvas.height + radius / 2;
        let factor = Math.min(this.canvas.height, this.canvas.width);

        this.staticContext.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
        this.staticContext.beginPath();
        this.staticContext.arc(centerX, centerY, radius, -Math.PI + this.arcSize, 0 - this.arcSize, false);
        this.staticContext.arc(centerX, centerY, radius * (1 - this.thickness), 0 - this.arcSize, -Math.PI + this.arcSize, true);
        this.staticContext.closePath();
        this.staticContext.fillStyle = this.backgroundStyle;
        this.staticContext.fill();

        this.staticContext.textAlign = "center";
        const fontSize = clamp(factor * 0.1, 10, 20);
        this.staticContext.font = fontSize + "px Arial";
        this.staticContext.fillStyle = this.textStyle;
        this.staticContext.fillText(this.channelDisplayName, centerX, centerY * 1.05);
    }
}