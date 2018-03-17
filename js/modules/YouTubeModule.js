import {Module} from "../Module.js";
export class YouTubeModule extends Module {
    constructor(id, area, videoSource) {
        super(id, area);
        this.videoSource = videoSource;
    }

    view() {
        return m("iframe[frameborder='0'][allow='encrypted-media'][allowfullscreen='']", {
                src: this.videoSource,
                style: {
                    "grid-area": this.area,
                    "align-self": "stretch",
                    "justify-self": "stretch"
                }
            }
        );
    }
}