import {CanvasGauge} from "./modules/CanvasGauge.js";
import {Config} from "./config/Config.js";
import {CircleCanvasGauge} from "./modules/CircleCanvasGauge.js";
import {EmptyModule} from "./modules/EmptyModule.js";
import {YouTubeModule} from "./modules/YouTubeModule.js";
import Application from "./Application.js";
import {ImageModule} from "./modules/ImageModule.js";
import {ChartModule} from "./modules/ChartModule.js";
import {LinearGauge} from "./modules/LinearGauge.js";
import {EditButton} from "./modules/EditButton.js";
import { emptyLayout } from "./config/layout_presets/EmptyLayout.js";
import { raceLayout } from "./config/layout_presets/RaceLayout.js";
import { demoLayout } from "./config/layout_presets/DemoLayout.js";

/**
 * Manages the grid layout of the application. It handles loading and saving of the layout, among other things.
 */
export class Layout {
    /**
     * Creates a new layout instance
     */
    constructor() {
        /**
         * Counter variable to create unique module IDs
         * @type {number}
         */
        this.idGen = 0;

        /**
         * Defines if the application is in edit mode or not
         * @type {boolean}
         */
        this.editMode = false;

        /**
         * The amount of rows that the grid has. Used to generate empty cells
         * @type {number}
         */
        this.rows = 6;

        /**
         * The amount of columns that the grid has. Used to generate empty cells
         * @type {number}
         */
        this.columns = 2;

        /**
         * Defines if we're using the mobile version of the layout
         * @type {boolean}
         */
        this.isMobile = true;

        /**
         * Helper variable to prevent media query events being initialized multiple times
         * @type {boolean}
         */
        this.mediaQueryInitialized = false;

        /**
         * Defines the layout presets which are available
         * @type {Module[]}
         */
        this.layoutPresets = [ raceLayout, emptyLayout, demoLayout ];

        /**
         * The default layout to load when no layout has been found
         */
        this.defaultLayout = emptyLayout;

        /**
         * The active layout
         */
        this.layout = null;
    }

    /**
     * Loads the layout from localStorage
     * @returns {Module[]} An array containing all loaded modules and an empty module for each cell
     */
    load() {
        const modules = [];
        this.initMediaQueryWatch();

        try {
            this.layout = JSON.parse(localStorage.getItem("layout"));
            if (this.layout === null || Config.alwaysUseDefaultLayout) {
                this.layout = this.defaultLayout;
            }

            const layoutModules = this.isMobile ? this.layout.mobileModules : this.layout.desktopModules;
            layoutModules.forEach((module) => {
                modules.push(this.createModule(module));
            });

            // Add the edit button as a static module
            modules.push(new EditButton(this.idGen++, "1 / 1 / 1 / 3"));
        } catch(error) {
            console.dir(error);
            localStorage.removeItem("layout");
            return this.load();
        }

        return [...modules, ...this.initEmptyCells()];
    }

    /**
     * SmoothieChart creates tooltips in the DOM. This method removes all tooltips (useful when reloading)
     * @private
     */
    static cleanUpSmoothieChartsTooltips() {
        // https://stackoverflow.com/questions/10842471/remove-all-elements-of-a-certain-class-with-javascript
        [].forEach.call(document.querySelectorAll(".smoothie-chart-tooltip"), (e) => {
            e.parentNode.removeChild(e);
        });
    }

    /**
     * Initializes an event listener listening on screen size changes
     * @private
     */
    initMediaQueryWatch() {
        if(this.mediaQueryInitialized) {
            return;
        }
        this.mediaQueryInitialized = true;
        const mediaQuery = window.matchMedia("(min-width: 600px)");
        mediaQuery.addListener((mq) => this.onMediaQueryChange(mq));
        this.onMediaQueryChange(mediaQuery);
    }

    /**
     * Called when the screen has switched between mobile and desktop sizes.
     * Reloads the application if the size has been changed
     * @private
     * @param mediaQuery The media query object
     */
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

    /**
     * Initializes a module from a given configuration object
     * @private
     * @param {object} moduleConfig An object containing the configuration for this module. Includes module type and data channel, among others
     * @returns {Module} The initialized module
     */
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
                module = new YouTubeModule(this.idGen++, moduleConfig.gridArea);
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

        return module;
    }

    /**
     * Adds a new module to a given cell in the grid.
     * The layout gets saved after this operation
     * @param moduleType The type of the module
     * @param gridArea The CSS grid area of the cell
     * @param channel The data channel that the module should use
     */
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

    /**
     * Deletes a module from the grid.
     * The layout gets saved after this operation
     * @param id The DOM id of the module
     */
    deleteModule(id) {
        const module = Application.getModuleById(id);
        Application.modules.splice(Application.modules.indexOf(module), 1);
        this.saveLayout();
    }

    /**
     * Saves the current layout to localStorage
     */
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

    /**
     * Adds an EmptyModule (invisible dummy module) instance to each cell in the grid.
     * These are used by the interaction system to determine where an user has dragged a module
     * @private
     * @returns {Array<EmptyModule>} An array containing all the empty modules
     */
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

    /**
     * Toggles the edit mode of the layout
     */
    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    /**
     * Applies a specific layout, and saves it
     * @param layout The layout object to apply
     */
    applyLayout(layout) {
        localStorage.setItem("layout", JSON.stringify(layout));
        this.reload();
    }

    /**
     * Reloads the layout of the application
     */
    reload() {
        Application.dataProvider.reset();

        this.idGen = 0;
        Layout.cleanUpSmoothieChartsTooltips();
        Application.modules.length = 0;

        const modules = this.load();
        Application.modules.push(...modules);
        m.redraw();
    }
}