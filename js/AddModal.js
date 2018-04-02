import classnames from "classnames";
import Application from "./Application.js";

export class AddModal {
    constructor() {
        this.availableModules = [{id: "add-1", color: "red", type: "CanvasGauge"}, {id: "add-2", color: "blue", type: "CircleCanvasGauge"}, {id: "add-3", color: "green", type: "LinearGauge"}];
        this.isOpen = false;
        this.gridArea = null;
    }

    view() {
        return m(".modal#add-modal", { style: { display: this.isOpen ? "flex" : "none" }, onclick: (e) => this.closeModal(e, true) },
            m(".modal-content",
                m(".modal-header",
                    m("span.close", { onclick: (e) => this.closeModal(e, false) }, m.trust("&times;")),
                    m("h2", "New module")
                ),
                m(".modal-body",
                    this.availableModules.map(module => m(".cell", { id: module.id, class: classnames({"selected": module.selected}), style: { background: module.color }, onclick: e => this.selectModule(e) }))
                ),
                m(".modal-footer",
                    m("button", { onclick: e => this.addSelectedModule(e) }, "Add"),
                    m("button", { onclick: e => this.closeModal(e, false) },"Cancel")
                )
            )
        );
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
    }
}