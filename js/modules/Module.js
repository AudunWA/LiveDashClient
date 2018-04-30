import classNames from "../libraries/classnames.js";
import Application from "../Application.js";

/**
 * The base class for all modules
 */
export class Module {
    constructor(id, channel, area) {
        this.onDataFunction = (value) => this.onData(value);

        this.id = id;
        this.channel = channel;
        this.style = { "grid-area": area };
        this.preview = false;
        this.hovering = false;
        this.staticDomAttributes = {
            onclick: event => this.onClick(event),
            onmouseenter: event => this.onMouseEnter(event),
            onmouseleave: event => this.onMouseLeave(event)
        };

        if(this.channel != null) {
            this.minValue = this.channel.expectedmin || 0;
            this.maxValue = this.channel.expectedmax || 0;
        }

    }

    onClick(event) {
        if(this.preview) {
            Application.container.addModal.selectModule(this);
        }
    }

    onMouseEnter(event) {
        this.hovering = true;
    }

    onMouseLeave(event) {
        this.hovering = false;
    }

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

    get area() {
        return this.style["grid-area"];
    }

    set area(newArea) {
        this.style["grid-area"] = newArea;
    }

    get channel() {
        return this._channel;
    }

    set channel(value) {
        Application.dataProvider.unsubscribeModule(this);
        this._channel = value;

        if(this._channel != null) {
            Application.dataProvider.subscribeToChannel(this, this._channel.name);
        }
    }

    editControls() {
        return !this.preview && Application.layout.editMode && this.hovering ?
            m(".tooltip",
                m("button", { onclick: e => this.openEditModal(e) } ,"Edit"),
                m("button", { onclick: e => this.deleteMe(e) } ,"Remove")
            )
            : null;
    }

    deleteMe(e) {
        Application.layout.deleteModule(this.id);
    }

    openEditModal(e) {
        Application.openEditModal(this);
    }

    view(node) {

    }

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