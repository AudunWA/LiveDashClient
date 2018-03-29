import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class CircleCanvasGauge extends Module {
    constructor(id, area, thickness) {
        super(id, area);
        this.value = 0;
        this.percentage = 0;
        this.goalPercentage = 0;
        this.thickness = thickness;
        this.canvas = null;
        this.context = null;
        this.backgroundStyle = "#484f57";
        this.fillStyle = "#2594eb";
        this.textStyle = "#f7f6f4";
    }

    view() {
        return m("div.cell", {id: this.id, style: this.style},
            m("canvas.canvas-gauge", {id: this.getId()})
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
        this.goalPercentage = (value / (MAX_SPEED - MIN_SPEED)).clamp(MIN_SPEED, MAX_SPEED);
        this.value = value;
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    animate() {
        this.resize();

        this.percentage = Math.lerp(this.percentage, this.goalPercentage, 0.1);

        let centerX = this.canvas.width / 2;
        let centerY = this.canvas.height / 2;
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

        this.context.font = factor * 0.1 + "px Arial";
        this.context.fillStyle = this.textStyle;
        this.context.fillText(this.value + " km/h", centerX - factor * 0.15, centerY + factor * 0.05);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.001) {
            requestAnimationFrame(() => this.animate());
        }
    }
}