export const defaultLayout = {
    modules: [
        {
            type: "ImageModule",
            gridArea: "header",
            src: "res/revolve_logo1.png"
        },
        {
            type: "YouTubeModule",
            gridArea: "video",
            src: "https://www.youtube-nocookie.com/embed/1GGnX-p9jFg?autoplay=0"
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
    ]
};