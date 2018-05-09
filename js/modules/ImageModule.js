import {Module} from "./Module.js";

/**
 * A simple module for displaying an image
 */
export class ImageModule extends Module {
    /**
     * Initializes a new image module
     * @param {string} id The DOM ID of the module
     * @param {string} area The CSS grid-area which the module should reside in
     * @param imageSource The image URL
     */
    constructor(id, area, imageSource) {
        super(id, null, area);
        this.imageSource = imageSource;
    }

    /**
     * @inheritDoc
     */
    view() {
        return m("img.image-module", { id: this.id, src: this.imageSource, style: this.style});
    }

    /**
     * The image URL
     */
    get src() {
        return this.imageSource;
    }
}