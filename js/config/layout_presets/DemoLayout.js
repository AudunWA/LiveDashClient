export const demoLayout = {
    "id": "preset-demo",
    "name": "Demo",
    "description": "This preset is used for demonstration purposes, and contains a full grid.",
    "mobileModules": [{
        "type": "ImageModule",
        "gridArea": "header",
        "src": "res/revolve_logo1.png"
    }, {
        "type": "YouTubeModule",
        "gridArea": "2 / 1 / 4 / 3"
    }, {
        "type": "CanvasGauge",
        "gridArea": "4 / 1 / 4 / 1",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "CanvasGauge",
        "gridArea": "4 / 2 / 4 / 2",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "ChartModule",
        "gridArea": "5 / 1 / 7 / 3",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "LinearGauge",
        "gridArea": "7 / 1 / 7 / 1",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "LinearGauge",
        "gridArea": "7 / 2 / 7 / 2",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "CircleCanvasGauge",
        "gridArea": "8 / 1 / 8 / 1",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "CircleCanvasGauge",
        "gridArea": "8 / 2 / 8 / 2",
        "channel": "BMS_State_of_Charge"
    }],
    "desktopModules": [{
        "type": "CanvasGauge",
        "gridArea": "2 / 6 / 3 / 7",
        "channel": "INS_Ax"
    }, {
        "type": "CanvasGauge",
        "gridArea": "4 / 6 / 5 / 7",
        "channel": "INS_Az"
    }, {
        "type": "CanvasGauge",
        "gridArea": "3 / 6 / 4 / 7",
        "channel": "INS_Ay"
    }, {
        "type": "CanvasGauge",
        "gridArea": "2 / 1 / 3 / 2",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "CircleCanvasGauge",
        "gridArea": "5 / 2 / 6 / 3",
        "channel": "VCU_FZ_damp_FL"
    }, {
        "type": "YouTubeModule",
        "gridArea": "2 / 2 / 5 / 6",
        "channel": null,
        "src": "https://www.youtube.com/embed/live_stream?channel=UCGi73egyxd6a8K6eVnncCEA&autoplay=1"
    }, {
        "type": "ImageModule",
        "gridArea": "header",
        "channel": null,
        "src": "res/revolve_logo1.png"
    }, {
        "type": "ChartModule",
        "gridArea": "3 / 1 / 5 / 2",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "ChartModule",
        "gridArea": "5 / 4 / 7 / 7",
        "channel": "LiveDash_velocity"
    }, {
        "type": "LinearGauge",
        "gridArea": "5 / 1 / 6 / 2",
        "channel": "BMS_State_of_Charge"
    }, {
        "type": "ChartModule",
        "gridArea": "7 / 1 / 9 / 7",
        "channel": "INS_altitude"
    }, {
        "type": "LinearGauge",
        "gridArea": "6/1/6/1",
        "channel": "BMS_Min_Cell_Voltage"
    }, {
        "type": "CircleCanvasGauge",
        "gridArea": "5/3/5/3",
        "channel": "VCU_FZ_damp_FR"
    }, {
        "type": "CircleCanvasGauge",
        "gridArea": "6/2/6/2",
        "channel": "VCU_FZ_damp_RL"
    }, {
        "type": "CircleCanvasGauge",
        "gridArea": "6/3/6/3",
        "channel": "VCU_FZ_damp_RR"
    }]
};