import {CanvasGauge} from "./modules/CanvasGauge.js";
import {Config} from "./config/config.js";
import {CircleCanvasGauge} from "./modules/CircleCanvasGauge.js";
import {EmptyModule} from "./modules/EmptyModule.js";
import {YouTubeModule} from "./modules/YouTubeModule.js";
import Application from "./Application.js";
import {ImageModule} from "./modules/ImageModule.js";
import {ChartModule} from "./modules/ChartModule.js";
import {LinearGauge} from "./modules/LinearGauge.js";
import {EditButton} from "./modules/EditButton.js";

const defaultLayout = {
    modules: [
        {
            type: "CanvasGauge",
            gridArea: "5 / 3 / 6 / 4",
            channel: 1
        },
        {
            type: "CanvasGauge",
            gridArea: "6 / 3 / 6 / 3",
            channel: 1
        },
        {
            type: "CanvasGauge",
            gridArea: "4 / 6 / 4 / 6",
            channel: 1
        },
        {
            type: "CanvasGauge",
            gridArea: "2 / 1 / 3 / 2",
            channel: 1
        },
        {
            type: "CircleCanvasGauge",
            gridArea: "5 / 2 / 7 / 3",
            channel: 1
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
        },
        {
            type: "ChartModule",
            gridArea: "3 / 1 / 5 / 2",
            channel: 2
        },
        {
            type: "ChartModule",
            gridArea: "5 / 4 / 7 / 7",
            channel: 1
        },
        {
            type: "LinearGauge",
            gridArea: "5 / 4 / 5 / 4",
            channel: 1
        }
    ]
};

export class Layout {
    constructor() {
        this.idGen = 0;
        this.editMode = Config.editMode;
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

        // Add the edit button as a static module
        modules.push(new EditButton(this.idGen++, "1 / 1 / 1 / 1"));

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
            case "ChartModule":
                module = new ChartModule(this.idGen++, moduleConfig.gridArea);
                break;
            case "LinearGauge":
                module = new LinearGauge(this.idGen++, moduleConfig.gridArea);
                break;
        }
        module.channel = moduleConfig.channel;
        return module;
    }

    addModule(moduleType, gridArea) {
        const module = this.createModule({
            type: moduleType,
            gridArea: gridArea,
            channel: 1 // TODO
        });
        Application.modules.push(module);
        Application.dataProvider.subscribeToChannel(module.channel, (data) => module.onData(data));
        this.saveLayout();
    }

    deleteModule(id) {
        const module = Application.getModuleById(id);
        Application.modules.splice(Application.modules.indexOf(module), 1);
        this.saveLayout();
    }

    saveLayout() {
        const ignore = ["EmptyModule", "EditButton"];
        let layout = {modules: []};
        Application.modules.forEach((module) => {
            if(ignore.indexOf(module.constructor.name) !== -1) {
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

        // Start on row 2, we don't want users to move modules to the header
        for (let row = 2; row <= rows; row++) {
            for (let column = 1; column <= columns; column++) {
                emptyModules.push(new EmptyModule(this.idGen++, row + "/" + column + "/" + row + "/" + column));
            }
        }

        return emptyModules;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    reset() {
        this.saveDefaultLayout();
        Application.modules.length = 0;
        Application.modules.push(...this.load());
    }
}