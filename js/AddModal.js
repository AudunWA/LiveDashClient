import Application from "./Application.js";
import {CanvasGauge} from "./modules/CanvasGauge.js";
import {CircleCanvasGauge} from "./modules/CircleCanvasGauge.js";
import {LinearGauge} from "./modules/LinearGauge.js";
import {ChartModule} from "./modules/ChartModule.js";

export class AddModal {
    constructor() {
        this.availableModules = [
            {
                id: "add-1",
                color: "red",
                type: "CanvasGauge",
                view: new CanvasGauge(5555, "", 0.2, 0.4)
            }, 
            {
                id: "add-2",
                color: "blue",
                type: "CircleCanvasGauge",
                view: new CircleCanvasGauge(5557, "", 0.2, 0.4)
            },
            {
                id: "add-3",
                color: "green",
                type: "LinearGauge",
                view: new LinearGauge(5556, "", 0.2, 0.4)
            },
            {
                id: "add-4",
                color: "yellow",
                type: "ChartModule",
                view: new ChartModule(5554, "", 0.2, 0.4)
            }
        ];

        this.availableModules.forEach(module => module.view.preview = true);
        this.isOpen = false;
        this.gridArea = null;
        this.dataChannelNames = Array.from(Application.unpackerUtil.dataChannels.keys());
    }

    view() {
        return this.isOpen ? m(".modal#add-modal", { style: { display: this.isOpen ? "flex" : "none" }, onclick: (e) => this.closeModal(e, true) },
            m(".modal-content",
                m(".modal-header",
                    m("span.close", { onclick: (e) => this.closeModal(e, false) }, m.trust("&times;")),
                    m("h2", "New module")
                ),
                m(".modal-body",
                    this.availableModules.map(module => m(".cell", { id: module.id, class: classnames({"selected": module.selected}), style: { background: module.color }, onclick: e => this.selectModule(e) }, m(module.view)))
                ),
                m(".modal-footer",
                    m("select", this.dataChannelNames.map(key => m("option", { value: key }, key))),
                    m("button", { onclick: e => this.addSelectedModule(e) }, "Add"),
                    m("button", { onclick: e => this.closeModal(e, false) },"Cancel")
                )
            )
        ) : null;
    }

    closeModal(event, checkId) {
        if(checkId && event.target.id !== "add-modal" )
            return;

        this.__proto__.isOpen = false;
    }

    selectModule(event) {
        this.__proto__.selectedModule = this.__proto__.availableModules.find((module) => module.id === event.target.id);
        this.__proto__.availableModules.forEach(module => module.selected = false);
        this.__proto__.selectedModule.selected = true;
    }

    addSelectedModule(event) {
        const selectedModule = this.__proto__.selectedModule;
        if(!selectedModule)
            return;

        Application.layout.addModule(selectedModule.type, this.__proto__.gridArea);
        this.__proto__.isOpen = false;
        selectedModule.selected = false;
        this.__proto__.selectedModule = null;
    }
}