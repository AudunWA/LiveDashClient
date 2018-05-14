/**
 * Controls the network logic. It handles incoming and outgoing data over WebSocket, and lets modules subscribe to data channels
 */
export class DataProvider {
    /**
     * Initializes a new instance of a data provider
     */
    constructor() {
        /**
         * A map containing each callback for a specific data channel key
         * @private
         * @type {Map<string, dataCallback>}
         */
        this.dataChannelListeners = new Map();

        /**
         * A buffer for messages that we attempted to send before being connected to the server.
         * These gets sent immediately after we've connected to the server
         * @private
         * @type {string[]}
         */
        this.subscribeMessages = [];

        /**
         * The total amount of messages that has been received
         * @type {number}
         */
        this.messagesReceived = 0;

        /**
         * Specifies how big of a delay (in ms) there should be between when messages gets received and displayed
         */
        this.delay = 0;

        /**
         * The WebSocket connection used to send commands and receive telemetry data
         * @private
         * @type {WebSocket}
         */
        this.ws = null;

        /**
         * The time when WebScoket connection was established
         * @type {Date}
         */
        this.startTime = null;
    }

    /**
     * Asynchronously connects to the given WebSocket server.
     * Partly from {@link https://stackoverflow.com/questions/42304996/javascript-using-promises-on-websocket}
     * @param {string} uri The URI of the WebSocket server
     * @returns {Promise<WebSocket>} A promise which resolves with the connected WebSocket
     */
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

    /**
     * Callback for receiving messages from the WebSocket
     * @private
     * @param event The receive event
     */
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

    /**
     * Handles when the WebSocket connection gets closed
     * @private
     * @param message The disconnect message
     */
    onClose(message) {
        console.log("WebSocket disconnected, reconnecting");
        console.dir(message);
        this.connectWebSocket(this.ws.url);
    }

    /**
     * Distributes data from the WebSocket connection to the module callbacks
     * @private
     * @param {string} channelName The name of the channel
     * @param {number} data The current data value
     */
    onData(channelName, data) {
        this.messagesReceived++;
        let secondsSinceStart = (new Date().getTime() - this.startTime.getTime()) / 1000;
        const WINDOW_TITLE_UPDATE_PERIOD = 10;
        if(this.messagesReceived % WINDOW_TITLE_UPDATE_PERIOD === 0) {
            document.title = "MPS: " + this.messagesReceived / secondsSinceStart;
        }

        // Delay
        if(channelName === 31) {
            this.delay = parseInt(data);
        }

        if(!this.dataChannelListeners.has(channelName)) {
            return;
        }
        this.dataChannelListeners.get(channelName).forEach((callback) => callback(data));
        //setTimeout(() => this.dataChannelListeners.get(channelName).forEach((callback) => callback(data)), this.delay);

        // TODO: Should be decoupled from this class
        m.redraw();
    }

    /**
     * Subscribes a module to a channel using its defined callback.
     * @param {Module} module The module that should subscribe
     * @param {number} channelName The channel to subscribe to
     */
    subscribeToChannel(module, channelName) {
        if(!this.dataChannelListeners.has(channelName))
            this.dataChannelListeners.set(channelName, []);

        this.sendSubscribeMessage(channelName);
        this.dataChannelListeners.get(channelName).push(module.onDataFunction);
    }

    /**
     * Unsubscribe a given module's callback for its channel
     * @param {Module} module The given module
     */
    unsubscribeModule(module) {
        if(!module.channel)
            return;

        if(!this.dataChannelListeners.has(module.channel.name))
            return;

        const callbacks = this.dataChannelListeners.get(module.channel.name).filter(callback => callback !== module.onDataFunction);
        this.dataChannelListeners.set(module.channel.name, callbacks);
    }

    /**
     * Sends a message to the server, telling it that we want data from a channel.
     * If the WebScoket is not connected, we queue the message for later
     * @private
     * @param {string} channelName
     */
    sendSubscribeMessage(channelName) {
        if(this.ws) {
            this.ws.send(channelName);
        } else {
            this.subscribeMessages.push(channelName);
        }
    }

    /**
     * Clears all callbacks and resets the message counter for this data provider
     */
    reset() {
        this.dataChannelListeners.clear();
        this.messagesReceived = 0;
    }
}