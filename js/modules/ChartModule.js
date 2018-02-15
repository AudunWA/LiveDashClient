import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class ChartModule extends Module {
    constructor(area, id) {
        super(area);

        this.id = id;
        this.timeSeries = new TimeSeries();
        this.chart = new SmoothieChart({responsive: true, enableDpiScaling: false, limitFPS: 60, tooltip:true});
        this.chart.addTimeSeries(this.timeSeries, { strokeStyle: '#fdd025', fillStyle: '#56491b', lineWidth: 2 });
    }

    oncreate() {
        this.chart.streamTo(document.getElementById(this.id), 100);
    }

    view() {
        return m("div.cell", {style: {"grid-area": this.area}},
            m("canvas", { id: this.id, style: { height: "100%", width: "100%"}}
            ));
    }

    onData(value) {
        this.timeSeries.append(new Date().getTime(), value);
    }
}