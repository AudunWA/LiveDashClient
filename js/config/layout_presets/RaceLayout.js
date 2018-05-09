/**
 * A layout preset
 */
export const raceLayout = {
    id: "preset-race",
    name: "Race",
    description: "This preset is perfect if you just want to see the coolest values from the car.",
    mobileModules: [
        {
            type: "ImageModule",
            gridArea: "header",
            src: "res/revolve_logo1.png"
        },
        {
            type: "YouTubeModule",
            gridArea: "video"
        },
        {
            type: "CanvasGauge",
            gridArea: "4 / 1 / 4 / 1",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CanvasGauge",
            gridArea: "4 / 2 / 4 / 2",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "ChartModule",
            gridArea: "5 / 1 / 7 / 3",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "LinearGauge",
            gridArea: "7 / 1 / 7 / 1",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "LinearGauge",
            gridArea: "7 / 2 / 7 / 2",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CircleCanvasGauge",
            gridArea: "8 / 1 / 8 / 1",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CircleCanvasGauge",
            gridArea: "8 / 2 / 8 / 2",
            channel: "BMS_State_of_Charge"
        }
    ],
    desktopModules: [
        {
            type: "CanvasGauge",
            gridArea: "5 / 3 / 6 / 4",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CanvasGauge",
            gridArea: "6 / 3 / 6 / 3",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CanvasGauge",
            gridArea: "4 / 6 / 4 / 6",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CanvasGauge",
            gridArea: "2 / 1 / 3 / 2",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "CircleCanvasGauge",
            gridArea: "5 / 2 / 7 / 3",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "YouTubeModule",
            gridArea: "2 / 2 / 5 / 6"
        },
        {
            type: "ImageModule",
            gridArea: "header",
            src: "res/revolve_logo1.png"
        },
        {
            type: "ChartModule",
            gridArea: "3 / 1 / 5 / 2",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "ChartModule",
            gridArea: "5 / 4 / 7 / 7",
            channel: "BMS_State_of_Charge"
        },
        {
            type: "LinearGauge",
            gridArea: "5 / 4 / 5 / 4",
            channel: "BMS_State_of_Charge"
        }
    ]
};