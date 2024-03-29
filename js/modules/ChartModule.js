import {Module} from "./Module.js";
import {SmoothieChart, TimeSeries} from "../libraries/smoothie.js";
import {getRootCssProperty} from "../Util.js";

/**
 * A module containing a SmoothieCharts graph
 */
export class ChartModule extends Module {
    /**
     * @inheritDoc
     */
    constructor(id, channel, area) {
        super(id, channel, area);

        this.timeSeries = new TimeSeries();
        this.chart = new SmoothieChart(
            {
                dataChannelLabel: "",
                responsive: true,
                enableDpiScaling: false,
                limitFPS: 60,
                tooltip: true,
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

    /**
     * A Mithril lifecycle method which is called after the view has been rendered
     */
    oncreate() {
        this.chart.streamTo(document.getElementById(this.getCanvasId()), 100);
    }

    /**
     * @inheritDoc
     */
    view() {
        return m("div",
            Object.assign({
                id: this.id,
                class: this.classNames,
                style: this.style
            }, this.staticDomAttributes),
            m("canvas.chart", {id: this.getCanvasId()}),
            this.editControls()
        );
    }

    /**
     * The DOM ID of the canvas element used for the graph
     * @private
     * @returns {string}
     */
    getCanvasId() {
        return "chart-" + this.id;
    }

    /**
     * @inheritDoc
     */
    onData(value) {
        super.onData(value);

        this.chart.options.dataChannelLabel = this.channelDisplayName;
        this.chart.options.minValue = this.minValue;
        this.chart.options.maxValue = this.maxValue;
        this.timeSeries.append(new Date().getTime(), value);
    }
}