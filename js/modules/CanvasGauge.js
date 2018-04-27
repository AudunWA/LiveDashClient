import {Module} from "../Module.js";
import {getRootCssProperty} from "../Util.js";

export class CanvasGauge extends Module {
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

    view() {
        return m("div", Object.assign({id: this.id, class: this.classNames, style: this.style}, this.staticDomAttributes),
            m(".flex-center",
                m("canvas.canvas-gauge", {id: this.getId() + "-static"}),
                m("canvas.canvas-gauge", {id: this.getId()})
            ),
            this.editControls()
        );
    }

    oncreate() {
        // We have to use this.__proto__ to access the class instance, as this === vnode.state in lifecycle methods
        this.__proto__.canvas = document.getElementById(this.getId());
        this.__proto__.context = this.canvas.getContext("2d");
        this.__proto__.staticCanvas = document.getElementById(this.getId() + "-static");
        this.__proto__.staticContext = this.staticCanvas.getContext("2d");
        this.animate();
    }

    getId() {
        return "canvas-gauge-" + this.id;
    }

    onData(value) {
        super.onData(value);

        if(this.value === value)
            return;

        this.goalPercentage = (value / (this.maxValue - this.minValue)).clamp(0, 1);
        this.value = value;
        this.animate();
    }

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

    animate() {
        if(!this.canvas) {
            return;
        }

        this.resize();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.percentage = Math.lerp(this.percentage, this.goalPercentage, 0.1);

        let centerX = 1/2 * this.canvas.width;
        let centerY = 4/5 *  this.canvas.height;
        let factor = Math.min(this.canvas.offsetHeight, this.canvas.offsetWidth);
        let radius = factor * 0.6;
        let endAngle = (Math.PI - this.arcSize * 2) * this.percentage - (Math.PI - this.arcSize);

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI + this.arcSize, endAngle, false);
        this.context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle, -Math.PI + this.arcSize, true);
        this.context.closePath();
        this.context.fillStyle = this.fillStyle;
        this.context.fill();

        this.context.textAlign="center";
        this.context.font = factor * 0.1 + "px Arial";
        this.context.fillStyle = this.textStyle;
        this.context.fillText(this.value + " " + this.channel.unit, centerX, centerY * 0.85);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.001) {
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

    onClick(event) {
        super.onClick(event);
        this.goalPercentage = Math.random();
        this.animate();
    }

    drawStatic() {
        let centerX = 1 / 2 * this.staticCanvas.width;
        let centerY = 4 / 5 * this.staticCanvas.height;
        let factor = Math.min(this.staticCanvas.offsetHeight, this.staticCanvas.offsetWidth);
        let radius = factor * 0.6;

        this.staticContext.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
        this.staticContext.beginPath();
        this.staticContext.arc(centerX, centerY, radius, -Math.PI + this.arcSize, 0 - this.arcSize, false);
        this.staticContext.arc(centerX, centerY, radius * (1 - this.thickness), 0 - this.arcSize, -Math.PI + this.arcSize, true);
        this.staticContext.closePath();
        this.staticContext.fillStyle = this.backgroundStyle;
        this.staticContext.fill();

        this.staticContext.textAlign = "center";
        this.staticContext.font = factor * 0.1 + "px Arial";
        this.staticContext.fillStyle = this.textStyle;
        this.staticContext.fillText(this.channelDisplayName, centerX, centerY * 1.1);
    }
}