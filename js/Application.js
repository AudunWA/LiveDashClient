import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import "./Interactions.js";
import {Config} from "./config/config.js";
import {Layout} from "./Layout.js";
import {AddModal} from "./AddModal.js";

/**
 * The main singleton class of the application.
 * Inspired by https://k94n.com/es6-modules-single-instance-pattern
 */
class Application {
    constructor() {
        this.idGen = 0;
        this.layout = new Layout();
        this.modules = this.layout.load();
        this.dataProvider = new DataProvider();
        this.dataProvider.connectWebSocket(Config.webSocketUri);
    }

    initModules() {
        this.modules.forEach((module) =>
            this.dataProvider.subscribeToChannel(module.channel, (data) => module.onData(data)));
        class Container {
            constructor(modules) {
                this.modules = modules;
                this.addModal = new AddModal();
            }
            view() {
                return m("#content",
                    m("div#grid", this.modules.map((module) => m(module))),
                    m(this.addModal)
                );
            }
        }

        // m.render(document.body, m(Container));
        this.container = new Container(this.modules);
        m.mount(document.body, this.container);
    }

    /**
     * Returns the module with the specified id
     * @param id The ID
     * @returns {Module | undefined} The module
     */
    getModuleById(id) {
        // noinspection EqualityComparisonWithCoercionJS
        return this.modules.find((module) => module.id == id);
    }

    openAddModal(gridArea) {
        this.container.addModal.gridArea = gridArea;
        this.container.addModal.isOpen = true;
    }
}

const application = new Application();
export { application as default };