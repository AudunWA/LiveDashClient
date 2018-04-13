export class DataProvider {
    constructor() {
        this.dataChannelListeners = new Map();
        //this.simulateData();
        this.messagesReceived = 0;
    }

    // Partly from https://stackoverflow.com/questions/42304996/javascript-using-promises-on-websocket
    connectWebSocket(uri) {
        const connectPromise = new Promise(function (resolve, reject) {
            const ws = new WebSocket(uri);
            ws.binaryType = "arraybuffer";
            ws.addEventListener("open", () => resolve(ws));
            ws.addEventListener("error", (error) => reject(error));
        });

        connectPromise.then((webSocket) => {
            console.log("WebSocket connected!");
            this.ws = webSocket;
            this.ws.addEventListener("message", (message) => this.onMessage(message));
            this.ws.addEventListener("close", (event) => this.onClose(event));
            this.startTime = new Date();
        });

        connectPromise.catch((error) => {
            console.log(error);
        });

        return connectPromise;
    }

    onMessage(event) {
    //let dataView = new DataView(event.data);
    //let canId = dataView.getInt16(0, true);
    //let data = dataView.getInt16(2, true);
    //this.onData(canId, data);
        let json = JSON.parse(event.data);
        if (json.canId) {
            this.onData(json.canId, json.data);
        } else if (json.channel) {
            this.onData(json.channel, json.data);
        }
    }

    onClose(message) {
        console.log("WebSocket disconnected");
        console.dir(message);
    }

    onData(canId, data) {
        this.messagesReceived++;
        let secondsSinceStart = (new Date().getTime() - this.startTime.getTime()) / 1000;
        const WINDOW_TITLE_UPDATE_PERIOD = 10;
        if(this.messagesReceived % WINDOW_TITLE_UPDATE_PERIOD === 0) {
            document.title = "MPS: " + this.messagesReceived / secondsSinceStart;
        }

        // Delay
        if(canId === 31) {
            this.delay = parseInt(data);
        }

        if(!this.dataChannelListeners.has(canId)) {
            return;
        }
        this.dataChannelListeners.get(canId).forEach((callback) => callback(data));
        //setTimeout(() => this.dataChannelListeners.get(canId).forEach((callback) => callback(data)), this.delay);

        // TODO: Should be decoupled from this class
        m.redraw();
    }

    subscribeToChannel(canId, callback) {
        if(!this.dataChannelListeners.has(canId))
            this.dataChannelListeners.set(canId, []);

        this.sendSubscribeMessage(canId);
        this.dataChannelListeners.get(canId).push(callback);
    }

    sendSubscribeMessage(channelName) {
        this.ws.send(channelName);
    }

    // simulateData() {
    //     const CAN_ID = 50;
    //     let counter = 0;
    //     let increment = 1;
    //     setInterval(() => {
    //         this.onData(CAN_ID, counter);
    //         this.onData(1, MAX_SPEED - counter);
    //         counter += increment;
    //         if(counter > 120 || counter < 0) increment = -increment;
    //     }, 1000/10);
    // }
}