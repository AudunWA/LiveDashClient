import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import "./Interactions.js";
import {Config} from "./config/Config.js";
import {Layout} from "./Layout.js";
import {AddModal} from "./modals/AddModal.js";
import {UnpackerUtil} from "./UnpackerUtil.js";
import {EditModal} from "./modals/EditModal.js";
import {WelcomeModal} from "./modals/WelcomeModal.js";

/**
 * The main singleton class of the application.
 * Inspired by https://k94n.com/es6-modules-single-instance-pattern
 */
class Application {
    /**
     * Initializes the singleton instance of Application
     * @private
     */
    constructor() {
        /**
         * The layout instance of the application
         * @type {Layout}
         */
        this.layout = new Layout();

        /**
         * The unpacker util instance of the application
         * @type {UnpackerUtil}
         */
        this.unpackerUtil = new UnpackerUtil();

        /**
         * The data provider of the application
         * @type {DataProvider}
         */
        this.dataProvider = new DataProvider();

        /**
         * The list of all the modules in the application
         * @type {Module[]}
         */
        this.modules = null;

        /**
         * The root Mithril container for the application, it contains all the modules and modals
         * @type {Container}
         */
        this.container = null;
    }

    /**
     * Initializes the application
     * @returns {Promise}
     */
    async initModules() {
        const connectPromise = this.dataProvider.connectWebSocket(Config.webSocketUri);
        const unpackerLoadPromise = this.unpackerUtil.loadUnpacker(Config.unpackerUrl);
        await unpackerLoadPromise;
        //await Promise.all([connectPromise, unpackerLoadPromise]);

        this.modules = this.layout.load();

        /**
         * Contains all the views of the application
         */
        class Container {
            constructor(modules) {
                this.modules = modules;
                this.addModal = new AddModal();
                this.editModal = new EditModal();
                this.welcomeModal = new WelcomeModal();
            }
            view() {
                return m("#content",
                    m("div#grid", this.modules.map((module) => m(module))),
                    m(this.addModal),
                    m(this.editModal),
                    m(this.welcomeModal)
                );
            }
        }

        // m.render(document.body, m(Container));
        this.container = new Container(this.modules);
        m.mount(document.body, this.container);

        this.checkWelcomeModal();
    }

    /**
     * Checks if the welcome modal should be open, and opens it if it should
     * @private
     */
    checkWelcomeModal() {
        if(!localStorage.getItem("hasBeenUsedBefore")) {
            this.openWelcomeModal();
        }
    }

    /**
     * Returns the module with the specified id
     * @param {number} id The ID
     * @returns {Module | undefined} The module
     */
    getModuleById(id) {
        // noinspection EqualityComparisonWithCoercionJS
        return this.modules.find((module) => module.id == id);
    }

    /**
     * Opens the AddModal instance for adding a module to a given cell
     * @param {string} gridArea The grid area of the cell where the user wants to place a module
     */
    openAddModal(gridArea) {
        this.container.addModal.gridArea = gridArea;
        this.container.addModal.isOpen = true;
    }

    /**
     * Opens the EditModal instance for a given module
     * @param {Module} module The module to edit
     */
    openEditModal(module) {
        this.container.editModal.open(module);
    }

    /**
     * Opens the WelcomeModal instance
     */
    openWelcomeModal() {
        this.container.welcomeModal.isOpen = true;
    }
}

/**
 * An singleton instance of the Application class
 */
export default (new Application());