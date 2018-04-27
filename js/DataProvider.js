import { Module } from "./Module.js";

export class DataProvider {
    constructor() {
        this.dataChannelListeners = new Map();
        this.subscribeMessages = [];
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
            this.subscribeMessages.forEach(message => this.sendSubscribeMessage(message));
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

    /**
     * Subscribes a module to a channel using its defined callback.
     * @param {Module} module The module that should subscribe
     * @param {Number} channelName The channel to subscribe to
     */
    subscribeToChannel(module, channelName) {
        if(!this.dataChannelListeners.has(channelName))
            this.dataChannelListeners.set(channelName, []);

        this.sendSubscribeMessage(channelName);
        this.dataChannelListeners.get(channelName).push(module.onDataFunction);
    }

    unsubscribeModule(module) {
        if(!module.channel)
            return;

        if(!this.dataChannelListeners.has(module.channel.name))
            return;

        const callbacks = this.dataChannelListeners.get(module.channel.name).filter(callback => callback !== module.onDataFunction);
        this.dataChannelListeners.set(module.channel.name, callbacks);
    }

    sendSubscribeMessage(channelName) {
        if(this.ws) {
            this.ws.send(channelName);
        } else {
            this.subscribeMessages.push(channelName);
        }
    }

    reset() {
        this.dataChannelListeners.clear();
        this.messagesReceived = 0;
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