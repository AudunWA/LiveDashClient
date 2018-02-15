import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import {Speedometer} from "./modules/Speedometer.js";
import {ImageModule} from "./modules/ImageModule.js";
import {YouTubeModule} from "./modules/YouTubeModule.js";
import {LinearGauge} from "./modules/LinearGauge.js";

let dataProvider = new DataProvider();

let logo = new ImageModule("header", "res/revolve_logo1.png");
let video = new YouTubeModule("video", "https://www.youtube-nocookie.com/embed/1jdknVf5mxw?autoplay=0");
let speed1 = new Speedometer("w1");
let speed2 = new Speedometer("w2");
let speed3 = new Speedometer("w3");
let speed4 = new Speedometer("w4");
let linear = new LinearGauge("w5");
let linear2 = new LinearGauge("w7");

let modules = [ linear, linear2, logo, video, speed1, speed2, speed3, speed4];

class Container {
    view() {
        return m("div#grid", modules.map((module) => m(module)))
    }
}

// m.render(document.body, m(Container));
m.mount(document.body, Container);

dataProvider.subscribeToChannel(50, (data) => speed4.onData(data));
dataProvider.subscribeToChannel(1, (data) => speed1.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed2.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed3.onData(data));
dataProvider.subscribeToChannel(50, (data) => linear.onData(data));
dataProvider.subscribeToChannel(1, (data) => linear2.onData(data));
