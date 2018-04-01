import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import "./Interactions.js";
import {Config} from "./config/config.js";
import {Layout} from "./Layout.js";

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
            }
            view() {
                return m("div#grid", this.modules.map((module) => m(module)))
            }
        }

        // m.render(document.body, m(Container));
        m.mount(document.body, new Container(this.modules));
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
}

const application = new Application();
export { application as default };