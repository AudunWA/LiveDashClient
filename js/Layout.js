import {CanvasGauge} from "./modules/CanvasGauge.js";
import {Config} from "./config/config.js";
import {CircleCanvasGauge} from "./modules/CircleCanvasGauge.js";
import {EmptyModule} from "./modules/EmptyModule.js";
import {YouTubeModule} from "./modules/YouTubeModule.js";
import Application from "./Application.js";
import {ImageModule} from "./modules/ImageModule.js";

const defaultLayout = {
    modules: [
        {
            type: "CanvasGauge",
            gridArea: "w4",
            channel: 1,
        },
        {
            type: "CanvasGauge",
            gridArea: "w5",
            channel: 1,
        },
        {
            type: "CanvasGauge",
            gridArea: "w6",
            channel: 1,
        },
        {
            type: "CanvasGauge",
            gridArea: "w7",
            channel: 1,
        },
        {
            type: "CircleCanvasGauge",
            gridArea: "w8",
            channel: 1,
        },
        {
            type: "YouTubeModule",
            gridArea: "video",
            src: "https://www.youtube-nocookie.com/embed/1GGnX-p9jFg?autoplay=0"
        },
        {
            type: "ImageModule",
            gridArea: "header",
            src: "res/revolve_logo1.png"
        }
    ]
};

export class Layout {
    constructor() {
        this.idGen = 0;
    }
    load() {
        let layout = JSON.parse(localStorage.getItem("layout"));
        if(layout === null || Config.alwaysUseDefaultLayout) {
            layout = defaultLayout;
            this.saveDefaultLayout();
        }

        const modules = [];

        // TODO: Load default layout if the current layout is invalid
        layout.modules.forEach((module) => {
            modules.push(this.createModule(module));
        });
        return [...modules, ...this.initEmptyCells()];
    }

    createModule(moduleConfig) {
        let module;
        switch (moduleConfig.type) {
            case "CanvasGauge":
                module = new CanvasGauge(this.idGen++, moduleConfig.gridArea, 0.2, 0.4);
                break;
            case "CircleCanvasGauge":
                module = new CircleCanvasGauge(this.idGen++, moduleConfig.gridArea, 0.4);
                break;
            case "YouTubeModule":
                module = new YouTubeModule(this.idGen++, moduleConfig.gridArea, moduleConfig.src);
                break;
            case "ImageModule":
                module = new ImageModule(this.idGen++, moduleConfig.gridArea, moduleConfig.src);
                break;
        }
        module.channel = moduleConfig.channel;
        return module;
    }

    saveLayout() {
        let layout = {modules: []};
        Application.modules.forEach((module) => {
            if(module.constructor.name === "EmptyModule") {
                return;
            }

            layout.modules.push({
                type: module.constructor.name,
                gridArea: module.area,
                channel: module.channel,
                src: module.src
            });
        });
        localStorage.setItem("layout", JSON.stringify(layout));
    }

    saveDefaultLayout() {
        localStorage.setItem("layout", JSON.stringify(defaultLayout));
    }

    initEmptyCells() {
        const emptyModules = [];
        const rows = 7;
        const columns = 6;
        for (let row = 1; row <= rows; row++) {
            for (let column = 1; column <= columns; column++) {
                emptyModules.push(new EmptyModule(this.idGen++, row + "/" + column + "/" + row + "/" + column));
            }
        }
        // const gridTemplateAreas = "header header "
        //         +"w1 video w3 "
        //         +"w2 video video w4 "
        //         +"video video w4 "
        //         +"w5 w6 w7 w8 "
        //         +"w9 w10 w11 w12";
        // const gridTemplateAreas = document.getElementById("grid").style.gridTemplateAreas;
        // let gridAreas = gridTemplateAreas.split(" ");
        // gridAreas = [...new Set(gridAreas)];
        // gridAreas.forEach((area) => emptyModules.push(new EmptyModule(this.idGen++, area)));
        return emptyModules;
    }
}