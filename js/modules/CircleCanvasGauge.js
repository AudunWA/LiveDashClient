import {Module} from "../Module.js";
import {getRootCssProperty} from "../Util.js";

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
        return m(".", Object.assign({
                id: this.id,
                class: this.classNames,
                style: this.style,
                onmouseenter: e => this.hovering = true,
                onmouseleave: e => this.hovering = false
            }, this.domAttributes),
            m("canvas.canvas-gauge", {id: this.getId()}),
            this.editControls()
        );
    }

    oncreate() {
        // We have to use this.__proto__ to access the class instance, as this === vnode.state in lifecycle methods
        this.__proto__.canvas = document.getElementById(this.getId());
        this.__proto__.context = this.canvas.getContext("2d");
        this.animate();
    }

    getId() {
        return "canvas-gauge-" + this.id;
    }

    onData(value) {
        super.onData(value);

        this.goalPercentage = (value / (this.maxValue - this.minValue)).clamp(0, 1);
        this.value = value;
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    animate() {
        if(!this.canvas) {
            return;
        }

        this.resize();

        this.percentage = Math.lerp(this.percentage, this.goalPercentage, 0.1);

        let centerX = this.canvas.width / 2;
        let centerY = 2/5 * this.canvas.height;
        let factor = Math.min(this.canvas.offsetHeight, this.canvas.offsetWidth);
        let radius = factor * 0.4;
        let endAngle =  2*Math.PI * this.percentage - Math.PI/2;

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI / 2, 3/2 * Math.PI, false);
        this.context.arc(centerX, centerY, radius * (1 - this.thickness), 3/2 * Math.PI, -Math.PI / 2, true);
        this.context.closePath();
        this.context.fillStyle = this.backgroundStyle;
        this.context.fill();

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI / 2, endAngle, false);
        this.context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle, -Math.PI / 2, true);
        this.context.closePath();
        this.context.fillStyle = this.fillStyle;
        this.context.fill();

        this.context.textAlign="center";
        this.context.font = factor * 0.1 + "px Arial";
        this.context.fillStyle = this.textStyle;
        this.context.fillText(this.value + " " + this.channel.unit, centerX, centerY * 1.1);

        this.context.fillText(this.channelDisplayName, centerX, centerY * 2.3);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.001) {
            requestAnimationFrame(() => this.animate());
        }
    }

    onClick(event) {
        super.onClick(event);
        this.goalPercentage = Math.random();
        this.animate();
    }
}