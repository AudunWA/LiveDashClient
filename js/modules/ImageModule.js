import {Module} from "../Module.js";
export class ImageModule extends Module {
    constructor(area, imageSource) {
        super(area);
        this.imageSource = imageSource;
    }
    view() {
        return m("img", { src: this.imageSource, style: { "grid-area": this.area, "align-self": "center"}});
    }
}