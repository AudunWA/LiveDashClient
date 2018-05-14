import classNames from "../libraries/classnames.js";
import Application from "../Application.js";

/**
 * The base class for all modules
 */
export class Module {
    /**
     * Initializes a new module
     * @param {string} id The DOM ID of the module
     * @param {object} channel The data channel which the module should subscribe to
     * @param {string} area The CSS grid-area which the module should reside in
     */
    constructor(id, channel, area) {
        /**
         * The callback for receiving data
         * @param value A data value
         */
        this.onDataFunction = (value) => this.onData(value);

        /**
         * The module's DOM ID
         * @type{string}
         */
        this.id = id;

        this.channel = channel;

        /**
         * The CSS style of the module, as a dictionary
         * @type {Object<string,string>}
         */
        this.style = { "grid-area": area };

        /**
         * Defines if this module is in preview mode, and should not be interactable
         * @type {boolean}
         */
        this.preview = false;

        /**
         * Defines if the pointer is currently hovering above this module
         * @type {boolean}
         */
        this.hovering = false;

        /**
         * A set of default attributes for the DOM node
         */
        this.staticDomAttributes = {
            onclick: event => this.onClick(event),
            onmouseenter: event => this.onMouseEnter(event),
            onmouseleave: event => this.onMouseLeave(event)
        };

        /**
         * The minimum data value expected from the data source
         * @type {number}
         */
        this.minValue = 0;

        /**
         * The maximum data value expected from the data source
         * @type {number}
         */
        this.maxValue = 0;

        if(this.channel != null) {
            this.minValue = this.channel.expectedmin || 0;
            this.maxValue = this.channel.expectedmax || 0;
        }

    }

    /**
     * Called when the module gets clicked on
     * @param event The click event arguments
     */
    onClick(event) {
        if(this.preview) {
            Application.container.addModal.selectModule(this);
        }
    }

    /**
     * Called when the pointer is entering the module cells
     * @param event The enter event arguments
     */
    onMouseEnter(event) {
        this.hovering = true;
    }

    /**
     * Called when the pointer is leaving the module cells
     * @param event The leave event arguments
     */
    onMouseLeave(event) {
        this.hovering = false;
    }

    /**
     * Generates a DOM compatible list of the HTML/CSS classes for the module
     * @returns {string} A space-separated list of the classes
     */
    get classNames() {
        return classNames(
            "cell",
            {
                //"module-preview": this.preview,
                //cell: !this.preview,
                edit: Application.layout.editMode && !this.preview,
                selected: this.selected
            }
        );
    }

    /**
     * The CSS grid area for the module
     */
    get area() {
        return this.style["grid-area"];
    }

    /**
     * The CSS grid area for the module
     */
    set area(newArea) {
        this.style["grid-area"] = newArea;
    }

    /**
     * The data channel to receive data from
     */
    get channel() {
        return this._channel;
    }

    /**
     * The data channel to receive data from
     */
    set channel(value) {
        Application.dataProvider.unsubscribeModule(this);
        this._channel = value;

        if(this._channel != null) {
            Application.dataProvider.subscribeToChannel(this, this._channel.name);
        }
    }

    /**
     * Generates a vnode for the edit and delete buttons for a module
     * @returns A Mithril VNode with the buttons
     */
    editControls() {
        return !this.preview && Application.layout.editMode && this.hovering ?
            m(".tooltip",
                m("button", { onclick: e => Application.openEditModal(this) } ,"Edit"),
                m("button", { onclick: e => Application.layout.deleteModule(this.id) } ,"Remove")
            )
            : null;
    }

    /**
     * The view lifecycle method, which is responsible for defining what to have in the DOM.
     * Called every time m.redraw() gets called
     * @returns A mithril VNode for this component
     */
    view() {

    }

    /**
     * Called when this module gets data from the channel it subscribes to
     * @callback dataCallback
     * @param value
     */
    onData(value) {
        if(value < this.minValue) {
            this.minValue = value;
        } else if(value > this.maxValue) {
            this.maxValue = value;
        }
    }

    /**
     * Returns the channel name to display.
     * If no display name has been set, it falls back to the internal name
     * @returns {string}
     */
    get channelDisplayName() {
        if(!this.channel.displayname || this.channel.displayname.length === 0) {
            return this.channel.name;
        }
        return this.channel.displayname;
    }
}