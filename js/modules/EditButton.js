import {Module} from "./Module.js";
import Application from "../Application.js";

/**
 * A module used by the layout to add buttons for editing and resetting the layout
 */
export class EditButton extends Module {
    /**
     * Initializes an edit-button modal
     * @param {string} id The DOM ID of the module
     * @param {string} area The CSS grid-area which the module should reside in
     */
    constructor(id, area) {
        super(id, null, area);

        /**
         * The text of the edit button
         * @type {string}
         */
        this.text = Application.layout.editMode ? "Finish editing" : "Edit layout";
    }

    /**
     * @inheritDoc
     */
    view() {
        return m(".top-buttons", {id: this.id, style: this.style},
            m("button", { onclick: (event) => this.onClick(event)}, this.text),
            m("button", { onclick: (event) => this.resetLayout(event)}, "Reset layout")
        );
    }

    /**
     * Toggles edit mode
     * @param event
     */
    onClick(event) {
        Application.layout.toggleEditMode();
        this.__proto__.text = Application.layout.editMode ? "Finish editing" : "Edit layout";
    }

    /**
     * Opens the welcome modal
     * @private
     * @param event
     */
    resetLayout(event) {
        Application.openWelcomeModal();
    }
}