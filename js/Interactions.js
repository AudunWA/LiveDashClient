import Application from "./Application.js";

interact('.cell')
    .draggable({
        inertia: true,
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },

        onmove: dragMoveListener,
        onend: function (event) {
            const emptyCellElement = document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.classList.contains("empty"));
            const module = Application.getModuleById(event.target.id);

            // Fix the position
            module.area = emptyCellElement.style.gridArea;
            module.style["transform"] = "";
            event.target.dataX = 0;
            event.target.dataY = 0;

            Application.layout.saveLayout();
        }
    }).resizable({
    // resize from all edges and corners
    edges: {left: true, right: true, bottom: true, top: true},

    // keep the edges inside the parent
    restrictEdges: {
        outer: 'parent',
        endOnly: true,
    },

    // minimum size
    restrictSize: {
        min: {width: 100, height: 50},
    },

    inertia: true,
}).on('resizemove', function (event) {
    const module = Application.getModuleById(event.target.id);
    const target = event.target;
    let x = parseFloat(target.dataX || 0) + event.dx;
    let y = parseFloat(target.dataY || 0) + event.dy;

    // update the element's style
    // target.style.width = event.rect.width + 'px';
    // target.style.height = event.rect.height + 'px';
    target.style.transformOrigin = calculateTransformOrigin(event.edges);
    module.style.transformOrigin = calculateTransformOrigin(event.edges);
    target.style.transform =
        "scale(" + event.rect.width / event.target.clientWidth
        + "," +  event.rect.height / event.target.clientHeight;

    module.style.transform =
        "scale(" + event.rect.width / event.target.clientWidth
        + "," +  event.rect.height / event.target.clientHeight;
}).on("resizeend", (event) => {
    let element = document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.classList.contains("empty"));
    const module = Application.getModuleById(event.target.id);

    module.area = calculateGridArea(event.target.style.gridArea, element.style.gridArea);
    module.style["transform"] = "";
    Application.layout.saveLayout();
});

function calculateGridArea(oldArea, newArea) {
    let oldAreaSplit = oldArea.split(" / ");
    let newAreaSplit = newArea.split(" / ");
    if (oldAreaSplit[0] > newAreaSplit[0] || oldAreaSplit[1] > newAreaSplit[1]) {
        let temp = oldAreaSplit;
        oldAreaSplit = newAreaSplit;
        newAreaSplit = temp;
    }
    return oldAreaSplit[0] + " / " + oldAreaSplit[1]
        + " / " + (parseInt(newAreaSplit[2]) + 1) + " / " + (parseInt(newAreaSplit[3]) + 1);
}

function calculateTransformOrigin(edges) {
    let origin = "";
    let topOrBottom = false;
    let leftOrRight = false;
    if (edges.top) {
        origin += "bottom";
        topOrBottom = true;
    }
    else if (edges.bottom) {
        origin += "top";
        topOrBottom = true;
    }
    if (edges.left) {
        origin += " right";
        leftOrRight = true;
    }
    else if (edges.right) {
        origin += " left";
        leftOrRight = true;
    }

    if (!topOrBottom) {
        origin = "center" + origin;
    }
    else if (!leftOrRight) {
        origin += " center";
    }
    return origin;
}

function dragMoveListener (event) {
    const module = Application.getModuleById(event.target.id);

    const x = parseFloat(event.target.dataX || 0) + event.dx;
    const y = parseFloat(event.target.dataY || 0) + event.dy;


    // Translate the element
    event.target.style.transform = "translate(" + x + "px, " + y + "px)";
    module.style.transform = "translate(" + x + "px, " + y + "px)";

    // Update the posiion attributes
    event.target.dataX = x;
    event.target.dataY = y;
}