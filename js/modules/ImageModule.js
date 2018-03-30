import {Module} from "../Module.js";
export class ImageModule extends Module {
    constructor(id, area, imageSource) {
        super(id, area);
        this.imageSource = imageSource;
    }
    view() {
        return m("img.image-module", { id: this.id, src: this.imageSource, style: this.style});
    }
    get src() {
        return this.imageSource;
    }
}