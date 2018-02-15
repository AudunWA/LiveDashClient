import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import {Speedometer} from "./modules/Speedometer.js";
import {ImageModule} from "./modules/ImageModule.js";
import {YouTubeModule} from "./modules/YouTubeModule.js";

let dataProvider = new DataProvider();

let logo = new ImageModule("header", "res/revolve_logo1.png");
let video = new YouTubeModule("video", "https://www.youtube-nocookie.com/embed/1jdknVf5mxw?autoplay=0");
let speed1 = new Speedometer("w1");
let speed2 = new Speedometer("w2");
let speed3 = new Speedometer("w3");
let speed4 = new Speedometer("w4");

let modules = [ logo, video, speed1, speed2, speed3, speed4];

class Container {
    view() {
        return m("div#grid", modules.map((module) => m(module)))
    }
}

m.mount(document.body, Container);

dataProvider.subscribeToChannel(50, (data) => speed4.onData(data));
dataProvider.subscribeToChannel(1, (data) => speed1.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed2.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed3.onData(data));