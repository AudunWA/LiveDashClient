const MIN_SPEED = 0;
const MAX_SPEED = 120;

Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};

class DataProvider {
    constructor() {
        this.dataChannelListeners = new Map();
        this.configureWebSocket();
        //this.simulateData();
        this.messagesReceived = 0;
    }

    configureWebSocket() {
        this.ws = new WebSocket("ws://localhost:8080");
        this.ws.binaryType = "arraybuffer";

        this.ws.onerror = (error) => {
            console.log(error);
        };

        this.ws.onopen = () => {
            console.log("WebSocket connected!");
            this.startTime = new Date();
        };

        this.ws.onmessage = (event) => {
            //let dataView = new DataView(event.data);
            //let canId = dataView.getInt16(0, true);
            //let data = dataView.getInt16(2, true);
            //this.onData(canId, data);
            let json=JSON.parse(event.data);
            if(json.canId) {
                this.onData(json.canId, json.data);
            }
        };

        this.ws.onclose = function(message) {
            $("#connection_label").html("Not connected");
        };
    }

    onData(canId, data) {
        this.dataChannelListeners.get(canId).forEach((callback) => callback(data));
        this.messagesReceived++;
        let secondsSinceStart = (new Date().getTime() - this.startTime.getTime()) / 1000;
        if(secondsSinceStart % 5) {
            document.title = "MPS: " + this.messagesReceived / secondsSinceStart;
        }
    }

    subscribeToChannel(canId, callback) {
        if(!this.dataChannelListeners.has(canId))
            this.dataChannelListeners.set(canId, []);

        this.dataChannelListeners.get(canId).push(callback);
    }

    simulateData() {
        const CAN_ID = 50;
        let counter = 0;
        let increment = 1;
        setInterval(() => {
            this.onData(CAN_ID, counter);
            this.onData(1, MAX_SPEED - counter);
            counter += increment;
            if(counter > 120 || counter < 0) increment = -increment;
        }, 1000/10);
    }
}


class Speedometer {
    constructor(id, area) {
        this.id = id;
        this.element = null;
        this.speedElement = null;
        this.pinElement = null;
        this.area = area;
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
        let percentage = speed/speedRange;
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

let dataProvider = new DataProvider();

let speed1 = new Speedometer("s1", "w1");
let speed2 = new Speedometer("s2", "w2");
let speed3 = new Speedometer("s3", "w3");
let speed4 = new Speedometer("s4", "w4");

let modules = [ speed1, speed2, speed3, speed4];

speed1.render(document.getElementById("grid"));
speed2.render(document.getElementById("grid"));
speed3.render(document.getElementById("grid"));
speed4.render(document.getElementById("grid"));

dataProvider.subscribeToChannel(50, (data) => speed4.onData(data));
dataProvider.subscribeToChannel(1, (data) => speed1.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed2.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed3.onData(data));

function interpolateTask() {
    modules.forEach((module) => module.update());
}

setInterval(() => interpolateTask(), 1000 / 24);