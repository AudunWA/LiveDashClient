import {Module} from "../Module.js";
import {SmoothieChart, TimeSeries} from "../libraries/smoothie.js";
import {getRootCssProperty} from "../Util.js";

const MIN_SPEED = 0;
const MAX_SPEED = 120;

export class ChartModule extends Module {
    constructor(id, channel, area) {
        super(id, channel, area);

        this.timeSeries = new TimeSeries();
        this.chart = new SmoothieChart(
            {
                dataChannelLabel: "",
                responsive: true,
                enableDpiScaling: false,
                limitFPS: 60,
                tooltip:true,
                grid: {
                    fillStyle: "rgba(0,0,0,0)",
                    strokeStyle: "#777777",
                    lineWidth: 1,
                    sharpLines: false,
                    millisPerLine: 0,
                    verticalSections: 3,
                    borderVisible: false
                },
                minValue: this.minValue,
                maxValue: this.maxValue
            }
        );
        this.chart.addTimeSeries(this.timeSeries,
            {
                strokeStyle: getRootCssProperty("--module-primary-color"),
                // fillStyle: getRootCssProperty("--module-secondary-color"),
                fillStyle: "rgba(0,0,0,0)",
                lineWidth: 2
            }
        );
    }

    oncreate() {
        this.chart.streamTo(document.getElementById(this.getCanvasId()), 100);
    }

    view() {
        return m("div", Object.assign({
                id: this.id,
                class: this.classNames,
                style: this.style,
                onmouseenter: () => this.hovering = true,
                onmouseleave: () => this.hovering = false
            }, this.domAttributes),
            m("canvas.chart", {id: this.getCanvasId()}),
            this.editControls()
        );
    }

    getCanvasId() {
        return "chart-" + this.id;
    }

    onData(value) {
        super.onData(value);

        this.chart.options.dataChannelLabel = this.channelDisplayName;
        this.chart.options.minValue = this.minValue;
        this.chart.options.maxValue = this.maxValue;
        this.timeSeries.append(new Date().getTime(), value);
    }
}