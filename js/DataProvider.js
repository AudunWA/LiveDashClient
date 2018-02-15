export class DataProvider {
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
            console.log("WebSocket disconnected");
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