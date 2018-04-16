import {Module} from "../Module.js";
import Application from "../Application.js";

export class YouTubeModule extends Module {
    constructor(id, area, videoSource) {
        super(id, area);
        this.videoSource = videoSource;
        this.style["align-self"] = "stretch";
        this.style["justify-self"] = "stretch";
    }

    view() {
        return m("div", Object.assign({
            id: this.id,
            class: this.classNames,
            style: this.style,
            onmouseenter: () => this.hovering = true,
            onmouseleave: () => this.hovering = false
        }, this.domAttributes),
        m("div.video-drag", { style: { width: this.dragWidth, height: this.dragHeight }}),
        m("iframe.video[frameborder='0'][allow='encrypted-media'][allowfullscreen='']", {
            src: this.videoSource,
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