import {Module} from "./Module.js";
import Application from "../Application.js";
import {Config} from "../config/config.js";

export class YouTubeModule extends Module {
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
                src: Config.youtubeVideoUrl,
            }),
            this.editControls()
        );
    }

    onupdate() {
        if(!Application.layout.editMode) {
            return;
        }

        // I could not get the video drag overlay to have the same size as its parent in CSS, so I've done it in JS.
        this.dragWidth = document.getElementById(this.id).clientWidth;
        this.dragHeight = document.getElementById(this.id).clientHeight;
    }

    get src() {
        return this.videoSource;
    }
}