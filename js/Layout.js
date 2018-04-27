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
import { layout as emptyLayout } from "./config/layout_presets/EmptyLayout.js";
import { layout as raceLayout } from "./config/layout_presets/RaceLayout.js";

export class Layout {
    constructor() {
        this.idGen = 0;
        this.editMode = Config.editMode;
        this.rows = 6;
        this.columns = 2;
        this.isMobile = true;
        this.mediaQueryInitialized = false;

        this.layoutPresets = [ raceLayout, emptyLayout ];
        //
        // this.layoutPresets = [
        //     { name: "Empty.desktop", layout: emptyLayoutDesktop },
        //     { name: "Empty.mobile", layout: emptyLayoutMobile },
        // ];
    }

    getCorrectDefaultLayout() {
        return raceLayout;
        // if(this.isMobile) {
        //     return defaultLayoutMobile;
        // }
        // return defaultLayoutDesktop;
    }

    load() {
        const modules = [];
        this.initMediaQueryWatch();

        // const layoutKey = this.isMobile ? "mobileLayout" : "desktopLayout";

        try {
            this.layout = JSON.parse(localStorage.getItem("layout"));
            if (this.layout === null || Config.alwaysUseDefaultLayout) {
                this.layout = this.getCorrectDefaultLayout();
                this.saveDefaultLayout();
            }



            const layoutModules = this.isMobile ? this.layout.mobileModules : this.layout.desktopModules;
            layoutModules.forEach((module) => {
                modules.push(this.createModule(module));
            });

            // Add the edit button as a static module
            modules.push(new EditButton(this.idGen++, "1 / 1 / 1 / 3"));

            // Redraw on resize
            // window.addEventListener("resize", () => {
            //     console.log("Resize");
            //     return m.redraw();
            // });
        } catch(error) {
            console.dir(error);
            localStorage.removeItem("layout");
            return this.load();
        }

        return [...modules, ...this.initEmptyCells()];
    }

    cleanUpSmoothieChartsTooltips() {
        // https://stackoverflow.com/questions/10842471/remove-all-elements-of-a-certain-class-with-javascript
        [].forEach.call(document.querySelectorAll(".smoothie-chart-tooltip"), (e) => {
            e.parentNode.removeChild(e);
        });
    }

    initMediaQueryWatch() {
        if(this.mediaQueryInitialized) {
            return;
        }
        this.mediaQueryInitialized = true;
        const mediaQuery = window.matchMedia("(min-width: 600px)");
        mediaQuery.addListener((mq) => this.onMediaQueryChange(mq));
        this.onMediaQueryChange(mediaQuery);
    }

    onMediaQueryChange(mediaQuery) {
        const oldIsMobile = this.isMobile;
        if(mediaQuery.matches) {
            // Desktop
            this.isMobile = false;
            this.rows = 8;
            this.columns = 6;
        } else {
            // Mobile
            this.isMobile = true;
            this.rows = 8;
            this.columns = 2;
        }
        if(Application.modules && oldIsMobile !== this.isMobile) {
            this.reload();
        }
    }

    createModule(moduleConfig) {
        let module;
        const channel = Application.unpackerUtil.dataChannels.get(moduleConfig.channel);
        switch (moduleConfig.type) {
            case "CanvasGauge":
                module = new CanvasGauge(this.idGen++, channel, moduleConfig.gridArea, 0.2, 0.4);
                break;
            case "CircleCanvasGauge":
                module = new CircleCanvasGauge(this.idGen++, channel, moduleConfig.gridArea, 0.4);
                break;
            case "YouTubeModule":
                module = new YouTubeModule(this.idGen++, moduleConfig.gridArea, moduleConfig.src);
                break;
            case "ImageModule":
                module = new ImageModule(this.idGen++, moduleConfig.gridArea, moduleConfig.src);
                break;
            case "ChartModule":
                module = new ChartModule(this.idGen++, channel, moduleConfig.gridArea);
                break;
            case "LinearGauge":
                module = new LinearGauge(this.idGen++, channel, moduleConfig.gridArea);
                break;
        }
        // const channelNames = Array.from(Application.unpackerUtil.dataChannels.keys()).filter((name) => !name.includes("BMS"));
        // module.channel =  channelNames[Math.floor(Math.random() * channelNames.length)];

        return module;
    }

    addModule(moduleType, gridArea, channel) {
        const module = this.createModule({
            type: moduleType,
            gridArea: gridArea,
            channel: channel
        });
        Application.modules.push(module);
        // Application.dataProvider.subscribeToChannel(module, module.channel.name);
        this.saveLayout();
    }

    deleteModule(id) {
        const module = Application.getModuleById(id);
        Application.modules.splice(Application.modules.indexOf(module), 1);
        this.saveLayout();
    }

    saveLayout() {
        // const layoutKey = this.isMobile ? "mobileLayout" : "desktopLayout";

        const ignore = ["EmptyModule", "EditButton"];
        const modules = [];
        Application.modules.forEach((module) => {
            if(ignore.indexOf(module.constructor.name) !== -1) {
                return;
            }

            modules.push({
                type: module.constructor.name,
                gridArea: module.area,
                channel: module.channel ? module.channel.name : null,
                src: module.src
            });
        });

        if(this.isMobile) {
            this.layout.mobileModules = modules;
        } else {
            this.layout.desktopModules = modules;
        }
        localStorage.setItem("layout", JSON.stringify(this.layout));
    }

    saveDefaultLayout() {
        // const layoutKey = this.isMobile ? "mobileLayout" : "desktopLayout";
        localStorage.setItem("layout", JSON.stringify(this.getCorrectDefaultLayout()));
    }

    initEmptyCells() {
        const emptyModules = [];

        // Start on row 2, we don't want users to move modules to the header
        for (let row = 2; row <= this.rows; row++) {
            for (let column = 1; column <= this.columns; column++) {
                emptyModules.push(new EmptyModule(this.idGen++, row + "/" + column + "/" + row + "/" + column));
            }
        }

        return emptyModules;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    applyLayout(layout) {
        localStorage.setItem("layout", JSON.stringify(layout));
        this.reload();
    }

    reset() {
        this.saveDefaultLayout();
        this.reload();
    }

    reload() {
        Application.dataProvider.reset();

        this.idGen = 0;
        this.cleanUpSmoothieChartsTooltips();
        Application.modules.length = 0;

        const modules = this.load();

        // modules.forEach((module) => {
        //     if(module.channel) {
        //         Application.dataProvider.subscribeToChannel(module, module.channel.name);
        //     }
        // });

        Application.modules.push(...modules);
        m.redraw();
    }
}