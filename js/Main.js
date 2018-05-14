import Application from "./Application.js";

// Fix for Microsoft Edge
if(!document.elementsFromPoint) {
    document.elementsFromPoint = (x, y) => Array.from(document.msElementsFromPoint(x,y));
}
// Wait for the DOM to be ready, then load modules
document.addEventListener("DOMContentLoaded", async () => await Application.initModules());