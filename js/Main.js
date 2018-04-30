import Application from "./Application.js";

// Wait for the DOM to be ready, then load modules
document.addEventListener("DOMContentLoaded", async () => await Application.initModules());