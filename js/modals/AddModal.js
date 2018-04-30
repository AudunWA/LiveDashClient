import Application from "../Application.js";
import {CanvasGauge} from "../modules/CanvasGauge.js";
import {CircleCanvasGauge} from "../modules/CircleCanvasGauge.js";
import {LinearGauge} from "../modules/LinearGauge.js";
import {ChartModule} from "../modules/ChartModule.js";

export class AddModal {
    constructor() {
        this.dataChannels = Application.unpackerUtil.dataChannels;
        this.selectedValue = this.dataChannels.values().next().value;
        this.availableModules = [
            new CanvasGauge("add-1", this.selectedValue, "", 0.2, 0.4),
            new CircleCanvasGauge("add-2", this.selectedValue, "", 0.2, 0.4),
            new LinearGauge("add-3", this.selectedValue, "", 0.2, 0.4),
            new ChartModule("add-4", this.selectedValue, "", 0.2, 0.4),
        ];

        this.availableModules.forEach(module => {
            // Application.dataProvider.subscribeToChannel(module, this.selectedValue.name);
            module.preview = true;
        });
        this.isOpen = false;
        this.gridArea = null;
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
            m(".modal-footer.top-buttons",
                m("div",
                    m("span.label", "Data channel: "),
                    m("select", {onchange: (e) => this.onSelectChange(e)},
                        Array.from(this.dataChannels.values(), channel => m("option", {value: channel.name}, channel.displayname || channel.name))
                    )
                ),
                m(".top-buttons",
                    m("button", {onclick: e => this.addSelectedModule(e)}, "Add"),
                    m("button", {onclick: e => this.closeModal(e, false)}, "Cancel")
                )
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
    }

    addSelectedModule(event) {
        const selectedModule = this.__proto__.selectedModule;
        if (!selectedModule)
            return;

        Application.layout.addModule(selectedModule.constructor.name, this.__proto__.gridArea, this.selectedValue.name);
        this.__proto__.isOpen = false;
        selectedModule.selected = false;
        this.__proto__.selectedModule = null;
    }

    onSelectChange(event) {
        const value = event.target.options[event.target.selectedIndex].value;
        this.selectedValue = this.dataChannels.get(value);
        this.availableModules.forEach(module => {
            module.channel = this.selectedValue;
        });
    }
}