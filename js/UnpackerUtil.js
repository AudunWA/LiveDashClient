import {Config} from "./config/Config.js";
import {customChannels} from "./config/CustomChannels.js";

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
        // Merge custom channels and unpacker
        Object.assign(unpackerJson, customChannels);

        Object.entries(unpackerJson).forEach(([_, channelList]) =>
            Object.entries(channelList).forEach(([channelName, data]) => {
                data.name = channelName;
                this.dataChannels.set(channelName, data);
            })
        );

        // Sort alphabetically, from https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object
        this.dataChannels = new Map([...this.dataChannels.entries()].sort(function(a,b){
            return (a[1].displayname || a[0]).localeCompare((b[1].displayname || b[0]));
        }));
    }

    getChannelDisplayNames() {
        const names = [];
        this.dataChannels.forEach((channel) => {
            names.push(channel.displayname.length > 0 ? channel.displayname : channel.name);
        });

        names.sort(function(a,b){
            return a.localeCompare(b);
        });
        return names;
    }
}