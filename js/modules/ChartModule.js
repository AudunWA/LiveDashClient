import {Module} from "../Module.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class ChartModule extends Module {
    constructor(area, id) {
        super(area);

        this.id = id;
        this.timeSeries = new TimeSeries();
        this.chart = new SmoothieChart(
            {
                responsive: true,
                enableDpiScaling: false,
                limitFPS: 60,
                tooltip:true,
                grid: {
                    fillStyle: '#30333a',
                    strokeStyle: '#777777',
                    lineWidth: 1,
                    sharpLines: false,
                    millisPerLine: 0,
                    verticalSections: 3,
                    borderVisible: false
                },
                minValue: 0,
                maxValue: 120
            }
            );
        this.chart.addTimeSeries(this.timeSeries,
            {
                strokeStyle: '#2299f7',
                fillStyle: 'rgba(0,0,0,0)',
                lineWidth: 2
            }
            );
    }

    oncreate() {
        this.chart.streamTo(document.getElementById(this.id), 100);
    }

    view() {
        return m("div.cell.fc", {style: {"grid-area": this.area}},
            m("canvas.chart", { id: this.id}
            ));
    }

    onData(value) {
        this.timeSeries.append(new Date().getTime(), value);
    }
}