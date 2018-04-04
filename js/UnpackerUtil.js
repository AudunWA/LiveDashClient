import {Config} from "./config/config.js";

export class UnpackerUtil {
    constructor() {
        this.dataChannels = new Map();
    }
    loadUnpacker() {
        return fetch(Config.unpackerUrl)
            .then((response) => {
                return response.json();
            })
            .then(json => this.processUnpacker(json))
            .catch(error => console.error("Could not load unpacker rules: " + error));
    }

    processUnpacker(unpackerJson) {
        Object.entries(unpackerJson).forEach(([_, channelList]) =>
            Object.entries(channelList).forEach(([channelName, data]) => this.dataChannels.set(channelName, data))
        );
    }
}