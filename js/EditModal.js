import Application from "./Application.js";
import {CanvasGauge} from "./modules/CanvasGauge.js";
import {CircleCanvasGauge} from "./modules/CircleCanvasGauge.js";
import {LinearGauge} from "./modules/LinearGauge.js";
import {ChartModule} from "./modules/ChartModule.js";

export class EditModal {
    constructor() {
        this.isOpen = false;
        this.dataChannels = Application.unpackerUtil.dataChannels;
        this.module = null;
        this.selectedChannel = null;
    }

    view() {
        return this.isOpen ? m(".modal#add-modal", {
            style: {display: this.isOpen ? "flex" : "none"},
            onclick: (e) => this.closeModal(e, true)
        },
        m(".modal-content.edit-modal-content",
            m(".modal-header",
                m("span.close", {onclick: (e) => this.closeModal(e, false)}, m.trust("&times;")),
                m("h2", "Edit module")
            ),
            m(".edit-modal-body",
                m("span.label", "Data channel: "),
                m("select", {onchange: (e) => this.onSelectChange(e)},
                    Array.from(this.dataChannels.values(), channel =>
                        m("option",
                            {
                                value: channel.name,
                                selected: this.selectedChannel.name === channel.name ? "selected" : null
                            },
                            channel.displayname || channel.name
                        )
                    )
                )
            ),
            m(".edit-modal-footer",
                m("button", {onclick: e => this.saveConfiguration(e)}, "Save"),
                m("button", {onclick: e => this.closeModal(e, false)}, "Cancel")
            )
        )
        ) : null;
    }

    saveConfiguration(event) {
        this.__proto__.module.__proto__.channel = this.selectedChannel;
        this.__proto__.isOpen = false;
        Application.layout.saveLayout();
    }

    open(module) {
        this.module = module;
        this.selectedChannel = this.module.channel;
        this.isOpen = true;
    }

    closeModal(event, checkId) {
        if (checkId && event.target.id !== "add-modal")
            return;

        this.__proto__.isOpen = false;
    }

    onSelectChange(event) {
        const value = event.target.options[event.target.selectedIndex].value;
        this.__proto__.selectedChannel = this.dataChannels.get(value);
    }
}