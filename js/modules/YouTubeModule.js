import {Module} from "../Module.js";
export class YouTubeModule extends Module {
    constructor(id, area, videoSource) {
        super(id, area);
        this.videoSource = videoSource;
    }

    view() {
        return m("div.cell.fc", {
            id: this.id,
            style: {
                "grid-area": this.area,
                "align-self": "stretch",
                "justify-self": "stretch"
            }
        }, m("iframe[frameborder='0'][allow='encrypted-media'][allowfullscreen='']", {
                src: this.videoSource,
                style: {
                    "align-self": "stretch",
                    "justify-self": "stretch"
                }
            }
        ),
            m("div.drag-bar[draggable]")
        );
    }
}