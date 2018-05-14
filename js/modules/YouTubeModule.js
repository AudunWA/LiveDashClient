import {Module} from "./Module.js";
import Application from "../Application.js";
import {Config} from "../config/Config.js";

/**
 * A module used to display an YouTube iframe with a video
 */
export class YouTubeModule extends Module {
    /**
     * Initializes a new YouTube module
     * @param {string} id The DOM ID of the module
     * @param {string} area The CSS grid-area which the module should reside in
     */
    constructor(id, area) {
        super(id, null, area);
    }

    view() {
        return m("div",
            Object.assign({
                id: this.id,
                class: this.classNames,
                style: this.style
            }, this.staticDomAttributes),
            m("div.video-drag", {
                style: {
                    width: this.dragWidth,
                    height: this.dragHeight,
                    "z-index": Application.layout.editMode ? 1 : -1
                }
            }),
            m("iframe.video[frameborder='0'][allow='encrypted-media'][allowfullscreen='']", {
                src: this.src,
            }),
            this.editControls()
        );
    }

    /**
     * Mithril lifecycle method. Called after view has finished
     */
    onupdate() {
        if(!Application.layout.editMode) {
            return;
        }

        // I could not get the video drag overlay to have the same size as its parent in CSS, so I've done it in JS.
        this.dragWidth = document.getElementById(this.id).clientWidth;
        this.dragHeight = document.getElementById(this.id).clientHeight;
    }

    /**
     * The source (src) attribute of the video
     */
    get src() {
        return Config.youtubeVideoUrl;
    }
}