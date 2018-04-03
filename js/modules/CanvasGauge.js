import {Module} from "../Module.js";
import Application from "../Application.js";

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
        this.canvas = null;
        this.context = null;
        this.backgroundStyle = "#484f57";
        this.fillStyle = "#2594eb";
        this.textStyle = "#f7f6f4";
    }

    view() {
        return m(".", {id: this.id, class: this.classNames, style: this.style, onmouseenter: e => this.hovering = true, onmouseleave: e => this.hovering = false},
            m("canvas.canvas-gauge", {id: this.getId()}),
            Application.layout.editMode && this.hovering ?
                m(".tooltip",
                    m("button", { onclick: e => this.openEditModal(e) } ,"Edit"),
                    m("button", { onclick: e => this.deleteMe(e) } ,"Remove")
                )
                : null,
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
        if(this.canvas.width === this.canvas.offsetWidth && this.canvas.height === this.canvas.clientHeight) {
            // No resize needed
            return;
        }
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    animate() {
        this.resize();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.percentage = Math.lerp(this.percentage, this.goalPercentage, 0.1);

        let centerX = this.canvas.width / 2;
        let centerY = 4 * this.canvas.height / 5;
        let factor = Math.min(this.canvas.offsetHeight, this.canvas.offsetWidth);
        let radius = factor * 0.6;
        let endAngle = (Math.PI - this.arcSize * 2) * this.percentage - (Math.PI - this.arcSize);

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI + this.arcSize, 0 - this.arcSize, false);
        this.context.arc(centerX, centerY, radius * (1 - this.thickness), 0 - this.arcSize, -Math.PI + this.arcSize, true);
        this.context.closePath();
        this.context.fillStyle = this.backgroundStyle;
        this.context.fill();

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, -Math.PI + this.arcSize, endAngle, false);
        this.context.arc(centerX, centerY, (radius) * (1 - this.thickness), endAngle, -Math.PI + this.arcSize, true);
        this.context.closePath();
        this.context.fillStyle = this.fillStyle;
        this.context.fill();

        this.context.font = factor * 0.1 + "px Arial";
        this.context.fillStyle = this.textStyle;
        this.context.fillText(this.value + " km/h", centerX - factor * 0.15, centerY * 0.85);

        this.context.fillText("Velocity (X)", centerX - factor * 0.35, centerY * 1.1);

        if (Math.abs(this.percentage - this.goalPercentage) > 0.001) {
            requestAnimationFrame(() => this.animate());
        }
    }

    deleteMe(e) {
        Application.layout.deleteModule(this.id);
    }

    openEditModal(e) {
        
    }
}