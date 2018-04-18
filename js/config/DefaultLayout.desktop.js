export const defaultLayout = {
    modules: [
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
            gridArea: "2 / 2 / 5 / 6",
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