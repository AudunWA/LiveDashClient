import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class CanvasGauge extends Module {
    constructor(id, area, arcSize, thickness) {
        super(id, area);
        this.value = 0;
        this.percentage = 0;
        this.goalPercentage = 0;
        this.arcSize = arcSize;
        this.thickness = thickness;
    }

    view() {
        return m("div.cell", {id: this.id, style: {"grid-area": this.area}},
            m("canvas.canvas-gauge", {id: this.getId()})
        );
    }

    oncreate() {
        this.canvas = document.getElementById(this.getId());
        this.context = this.canvas.getContext("2d");
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
        let centerY = 4 * this.canvas.height / 5;
        let factor = Math.min(this.canvas.offsetHeight, this.canvas.offsetWidth);
        let radius = factor * 0.6;

        this.context.beginPath();
        this.context.lineCap = "round";
        this.context.arc(centerX, centerY, radius, -Math.PI + this.arcSize, 0 - this.arcSize, false);
        this.context.arc(centerX, centerY, radius * (1 - this.thickness), 0 - this.arcSize, -Math.PI + this.arcSize, true);
        this.context.closePath();
        this.context.fillStyle = "#484f57";
        this.context.fill();

        this.context.beginPath();
        this.context.lineCap = "round";

        let endAngle = (Math.PI - this.arcSize * 2) * this.percentage - (Math.PI - this.arcSize);

        this.context.arc(centerX, centerY, radius, -Math.PI + this.arcSize, endAngle, false);
        this.context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle, -Math.PI + this.arcSize, true);
        this.context.closePath();
        this.context.fillStyle = "#2594eb";
        this.context.fill();

        this.context.font = factor * 0.1 + "px Arial";
        this.context.fillStyle = "#f7f6f4";
        this.context.fillText(this.value + " km/h", centerX - factor * 0.15, centerY * 0.85);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.001) {
            requestAnimationFrame(() => this.animate());
        }
    }
}