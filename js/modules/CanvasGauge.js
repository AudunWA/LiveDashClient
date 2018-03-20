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
        return m("div.cell", { id: this.id, style: { "grid-area": this.area } },
            m("canvas.canvas-gauge", { id: this.getId()})
        );
    }

    getId() {
        return "canvas-gauge-" + this.id;
    }

    onData(value) {
        this.goalPercentage = (value / (MAX_SPEED - MIN_SPEED)).clamp(MIN_SPEED, MAX_SPEED);
        this.value = value;
        this.animate();
    }

    animate() {
        this.percentage = Math.lerp(this.percentage, this.goalPercentage, 0.1);

        const canvas = document.getElementById(this.getId());
        const context = canvas.getContext("2d");

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.clientHeight;
        console.log(canvas.width);
        console.log(canvas.height);

        let centerX = canvas.width / 2;
        let centerY = 4* canvas.height / 5;
        let factor = Math.min(canvas.offsetHeight, canvas.offsetWidth);
        let radius = factor * 0.6;

        context.beginPath();
        context.lineCap = "round";
        context.arc(centerX, centerY, radius, -Math.PI+this.arcSize, 0-this.arcSize, false);
        context.arc(centerX, centerY, radius * (1 - this.thickness), 0-this.arcSize,-Math.PI+this.arcSize, true);
        context.closePath();
        context.fillStyle = "#484f57";
        context.fill();

        context.beginPath();
        context.lineCap = "round";

        let endAngle = (Math.PI-this.arcSize*2)*this.percentage-(Math.PI-this.arcSize);

        context.arc(centerX, centerY, radius, -Math.PI+this.arcSize, endAngle, false);
        context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle,-Math.PI+this.arcSize, true);
        context.closePath();
        context.fillStyle = "#2594eb";
        context.fill();

        context.font = factor * 0.1 + "px Arial";
        context.fillStyle = "#f7f6f4";
        context.fillText(this.value + " km/h",centerX - factor*0.15, centerY* 0.85);

        if(Math.abs(this.percentage - this.goalPercentage) > 0.001) {
            requestAnimationFrame(() => this.animate());
        }
    }
}