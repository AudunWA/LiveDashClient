import {customChannels} from "./config/CustomChannels.js";

/**
 * Loads and keeps track of the unpacker (dictionary with all the data channels in it)
 */
export class UnpackerUtil {
    /**
     * Initializes a new instance of the UnpackerUtil
     */
    constructor() {
        /**
         * Contains all the data channels
         * @type {Map<string, any>}
         */
        this.dataChannels = new Map();
    }

    /**
     * Loads and processes the unpacker
     * @param unpackerPath The URL of the unpacker to load
     * @returns {Promise<void>} A promise which resolves after the unpacker has been loaded and processed
     */
    loadUnpacker(unpackerPath) {
        return fetch(unpackerPath)
            .then((response) => {
                return response.json();
            })
            .then(json => this.processUnpacker(json))
            .catch(error => console.error("Could not load unpacker rules: " + error));
    }

    /**
     * Processes the raw unpacker JSON, making it easy to utilize in the code
     * @private
     * @param unpackerJson The raw unpacker JSON
     */
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
}