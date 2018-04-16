import Application from "./Application.js";
import {CanvasGauge} from "./modules/CanvasGauge.js";
import {CircleCanvasGauge} from "./modules/CircleCanvasGauge.js";
import {LinearGauge} from "./modules/LinearGauge.js";
import {ChartModule} from "./modules/ChartModule.js";

export class AddModal {
    constructor() {
        this.availableModules = [
            new CanvasGauge("add-1", "", 0.2, 0.4),
            new CircleCanvasGauge("add-2", "", 0.2, 0.4),
            new LinearGauge("add-3", "", 0.2, 0.4),
            new ChartModule("add-4", "", 0.2, 0.4),
        ];

        this.availableModules.forEach(module => module.preview = true);
        this.isOpen = false;
        this.gridArea = null;
        this.dataChannelNames = Array.from(Application.unpackerUtil.dataChannels.keys());
    }

    view() {
        return this.isOpen ? m(".modal#add-modal", {
            style: {display: this.isOpen ? "flex" : "none"},
            onclick: (e) => this.closeModal(e, true)
        },
        m(".modal-content",
            m(".modal-header",
                m("span.close", {onclick: (e) => this.closeModal(e, false)}, m.trust("&times;")),
                m("h2", "New module")
            ),
            m(".modal-body",
                this.availableModules.map(module => m(module))
                // this.availableModules.map(module => m(".module-preview", { id: module.id, class: classnames({"selected": module.selected}), style: { background: module.color }, onclick: e => this.selectModule(e) }, m(module.view)))
            ),
            m(".modal-footer",
                m("span", "Data channel: "),
                m("select#channel-select", this.dataChannelNames.map(key => m("option", {value: key}, key))),
                m("button", {onclick: e => this.addSelectedModule(e)}, "Add"),
                m("button", {onclick: e => this.closeModal(e, false)}, "Cancel")
            )
        )
        ) : null;
    }

    closeModal(event, checkId) {
        if (checkId && event.target.id !== "add-modal")
            return;

        this.__proto__.isOpen = false;
    }

    selectModule(module) {
        if (this.selectedModule) {
            this.selectedModule.selected = false;
        }

        this.selectedModule = module;
        this.selectedModule.selected = true;
        this.selectedModule.channel = this.getSelectedChannel();
    }

    addSelectedModule(event) {
        const selectedModule = this.__proto__.selectedModule;
        if (!selectedModule)
            return;
        const selectedValue = this.getSelectedChannel();

        Application.layout.addModule(selectedModule.constructor.name, this.__proto__.gridArea, selectedValue);
        this.__proto__.isOpen = false;
        selectedModule.selected = false;
        this.__proto__.selectedModule = null;
    }

    getSelectedChannel() {
        // TODO: Use binding/onchange event instead?
        const selectElement = document.getElementById("channel-select");
        return selectElement.options[selectElement.selectedIndex].value;
    }
}