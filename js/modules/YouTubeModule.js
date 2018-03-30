import {Module} from "../Module.js";
export class YouTubeModule extends Module {
    constructor(id, area, videoSource) {
        super(id, area);
        this.videoSource = videoSource;
        this.style["align-self"] = "stretch";
        this.style["justify-self"] = "stretch";
    }

    view() {
        return m("iframe[frameborder='0'][allow='encrypted-media'][allowfullscreen='']", {
                src: this.videoSource,
                style: this.style
            }
        );
    }

    get src() {
        return this.videoSource;
    }
}