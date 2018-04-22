import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import "./Interactions.js";
import {Config} from "./config/config.js";
import {Layout} from "./Layout.js";
import {AddModal} from "./AddModal.js";
import {UnpackerUtil} from "./UnpackerUtil.js";
import {EditModal} from "./EditModal.js";

/**
 * The main singleton class of the application.
 * Inspired by https://k94n.com/es6-modules-single-instance-pattern
 */
class Application {
    constructor() {
        this.idGen = 0;
        this.layout = new Layout();
        this.unpackerUtil = new UnpackerUtil();
        this.dataProvider = new DataProvider();
    }

    async initModules() {
        const connectPromise = this.dataProvider.connectWebSocket(Config.webSocketUri);
        const unpackerLoadPromise = this.unpackerUtil.loadUnpacker();
        await Promise.all([connectPromise, unpackerLoadPromise]);

        this.modules = this.layout.load();
        this.modules.forEach((module) => {
            if(!module.channel)
                return;
            return this.dataProvider.subscribeToChannel(module.channel.name || module.channel, (data) => module.onData(data));
        });
        class Container {
            constructor(modules) {
                this.modules = modules;
                this.addModal = new AddModal();
                this.editModal = new EditModal();
            }
            view() {
                return m("#content",
                    m("div#grid", this.modules.map((module) => m(module))),
                    m(this.addModal),
                    m(this.editModal)
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

    openEditModal(module) {
        this.container.editModal.module = module;
        this.container.editModal.isOpen = true;
    }
}

const application = new Application();
export { application as default };