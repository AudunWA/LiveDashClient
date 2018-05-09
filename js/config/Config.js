/**
 * The debugging/localhost configuration file of the application.
 * @property {string} webSocketUri The URI of the WebSocket server
 * @property {bool} alwaysUseDefaultLayout If set to true, the application always loads the default layout
 * @property {string} unpackerUrl The URL of the unpacker, which is used to load data channel metadata
 * @property {string} youtubeVideoUrl The URL of the YouTube video which should be displayed in the YouTubeModule
 */
export const Config = {
    // webSocketUri: "ws://localhost:8080",
    webSocketUri: "ws://ec2-54-152-31-98.compute-1.amazonaws.com:8080",
    alwaysUseDefaultLayout: false,
    // unpackerUrl: "https://raw.githubusercontent.com/RevolveNTNU/R18_TelemetryUnpackingRules/master/parserules.json",
    unpackerUrl: "https://raw.githubusercontent.com/RevolveNTNU/R18_TelemetryUnpackingRules/ELD/parserules.json",
    youtubeVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCGi73egyxd6a8K6eVnncCEA&autoplay=1"
};