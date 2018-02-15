import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class Speedometer extends Module {
    constructor(id, area) {
        super(id, area);
        this.speedElement = null;
        this.pinElement = null;
        this.speed = 0;
        this.currentRotation = 0;
        this.goalRotation = 0;
    }

    render(node) {
        let html = `
<div class="cell" style="grid-area: ${this.area}"><div id="${this.id}" class="speedometer">
    <!--Speed: <p class="speed">0</p>-->
    <div class="pin"></div>
</div></div>`;
        // let element = document.createElement("div");
        // element.class = "speedometer";
        // let paragraph = document.createElement("p");
        // paragraph.innerText = "Speedo";
        //
        // element.appendChild(paragraph);
        // node.appendChild(element);
        node.insertAdjacentHTML("beforeend", html);
        this.element = document.getElementById(this.id);
        this.pinElement = this.element.getElementsByClassName("pin")[0];
        // this.speedElement = this.element.getElementsByClassName("speed")[0];
    }

    calculateRotation(speed) {
        let speedRange = MAX_SPEED - MIN_SPEED;
        let percentage = speed / speedRange;
        return percentage * 180 - 90;
    }


    onData(value) {
        this.goalRotation = this.calculateRotation(value);
        this.speed = value;
        //  this.speedElement.innerText = value;
    }

    // set speed(value) {
    //     // this.speedElement.innerText = value;
    //     this.pinElement.style.transform = `rotate(${this.calculateRotation(value)}deg)`;
    // }

    update() {
        // this.speedElement.innerText = value;
        let nextRotation = Math.lerp(this.currentRotation, this.goalRotation, 0.2);
        this.currentRotation = nextRotation;
        this.pinElement.style.transform = `rotate(${nextRotation}deg)`;
    }
}