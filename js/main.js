import {DataProvider} from "./DataProvider.js";
import "./Util.js";
import {Speedometer} from "./modules/Speedometer.js";

let dataProvider = new DataProvider();

let speed1 = new Speedometer("s1", "w1");
let speed2 = new Speedometer("s2", "w2");
let speed3 = new Speedometer("s3", "w3");
let speed4 = new Speedometer("s4", "w4");

let modules = [ speed1, speed2, speed3, speed4];

speed1.render(document.getElementById("grid"));
speed2.render(document.getElementById("grid"));
speed3.render(document.getElementById("grid"));
speed4.render(document.getElementById("grid"));

dataProvider.subscribeToChannel(50, (data) => speed4.onData(data));
dataProvider.subscribeToChannel(1, (data) => speed1.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed2.onData(data));
dataProvider.subscribeToChannel(50, (data) => speed3.onData(data));

function interpolateTask() {
    modules.forEach((module) => module.update());
}

setInterval(() => interpolateTask(), 1000 / 24);