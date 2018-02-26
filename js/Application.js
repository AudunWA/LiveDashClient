import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import "./drag.js";
import {Speedometer} from "./modules/Speedometer.js";
import {ImageModule} from "./modules/ImageModule.js";
import {YouTubeModule} from "./modules/YouTubeModule.js";
import {LinearGauge} from "./modules/LinearGauge.js";
import {ChartModule} from "./modules/ChartModule.js";
import {LinearGaugeSet, Gauge} from "./modules/LinearGaugeSet.js";
import {EmptyModule} from "./modules/EmptyModule.js";

/**
 * The main singleton class of the application.
 * Inspired by https://k94n.com/es6-modules-single-instance-pattern
 */
class Application {
    constructor() {
        this.idGen = 0;
        this.modules = [];
        this.dataProvider = new DataProvider();
    }
    initModules() {
        let logo = new ImageModule(this.idGen++, "header", "res/revolve_logo1.png");
        let video = new YouTubeModule(this.idGen++, "video", "https://www.youtube-nocookie.com/embed/WzFatqWqfmk?autoplay=1");
        let speed1 = new Speedometer(this.idGen++, "w1");
        let speed2 = new Speedometer(this.idGen++, "w2");
        let speed3 = new Speedometer(this.idGen++, "w3");
        let speed4 = new Speedometer(this.idGen++, "w4");
        let linear = new LinearGauge(this.idGen++, "w5");
        let linear2 = new LinearGaugeSet(this.idGen++, "w7", [ new Gauge(0, 120, 1), new Gauge(0, 120, 50)]);
        let linear3 = new LinearGaugeSet(this.idGen++, "ww", [ new Gauge(0, 120, 1), new Gauge(0, 120, 50)]);
        let chart = new ChartModule(this.idGen++, "w6");
        let chart2 = new ChartModule(this.idGen++, "w8");

        this.modules = [  chart, chart2, linear, linear2, logo, video, speed1, speed2, speed3, speed4, new EmptyModule(this.idGen++, "1/1")];

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

        this.dataProvider.subscribeToChannel(50, (data) => speed4.onData(data));
        this.dataProvider.subscribeToChannel(1, (data) => speed1.onData(data));
        this.dataProvider.subscribeToChannel(50, (data) => speed2.onData(data));
        this.dataProvider.subscribeToChannel(50, (data) => speed3.onData(data));
        this.dataProvider.subscribeToChannel(50, (data) => linear.onData(data));
        linear2.subscribe(this.dataProvider);
        linear3.subscribe(this.dataProvider);
        this.dataProvider.subscribeToChannel(1, (data) => chart.onData(data));
        this.dataProvider.subscribeToChannel(2, (data) => chart2.onData(data));
    }

    /**
     * Returns the module with the specified id
     * @param id The ID
     * @returns {Module | undefined} The module
     */
    getModuleById(id) {
        return this.modules.find((module) => module.id == id);
    }
}

const application = new Application();
export { application as default };