import Application from "./Application.js";
import {getFirstIdFromParents} from "./Util.js";
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", getFirstIdFromParents(ev.target));
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let draggingElement = document.getElementById(data);

    let area1 = ev.target.style.gridArea;
    let area2 = draggingElement.style.gridArea;


    Application.getModuleById(getFirstIdFromParents(ev.target)).area = area2;
    Application.getModuleById(data).area = area1;
    // ev.target.style.gridArea = area2;
    // draggingElement.style.gridArea = area1;
    // ev.target.innerHTML = "";
    // ev.target.appendChild((draggingElement.children[0]));
}

document.addEventListener("dragstart", (event) => drag(event), false);
document.addEventListener("drop", (event) => drop(event), false);
document.addEventListener("dragover", (event) => event.preventDefault(), false);