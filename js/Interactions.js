import Application from "./Application.js";

let currentEdges = null;


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
function calculateGridArea(oldArea, newArea, edges) {
    const onlyVertical = ((edges.top || edges.bottom) && !(edges.left || edges.right));
    const onlyHorizontal = ((edges.left || edges.right) && !(edges.top || edges.bottom));
    let oldAreaSplit = oldArea.split(" / ");
    let newAreaSplit = newArea.split(" / ");

    let start = {
        row: parseInt(oldAreaSplit[0]),
        column: parseInt(oldAreaSplit[1]),
        endRow: parseInt(oldAreaSplit[2]),
        endColumn: parseInt(oldAreaSplit[3])
    };
    let target = {
        row: parseInt(newAreaSplit[0]),
        column: parseInt(newAreaSplit[1]),
    };
    let result = {
        startRow: start.row,
        endRow: start.endRow,
        startColumn: start.column,
        endColumn: start.endColumn
    };

    if(!onlyVertical) {
        if (start.endColumn >= target.column + 1 && start.column <= target.column) {
            if (edges.right) {
                // Make smaller (from right edge)
                result.startColumn = start.column;
                result.endColumn = target.column + 1;
            }
            else {
                // Make smaller (from left edge)
                result.startColumn = target.column;
                result.endColumn = start.endColumn;
            }
        }
        else {
            if (edges.right) {
                // Make bigger (from right edge)
                result.startColumn = start.column;
                result.endColumn = target.column + 1;
            }
            else {
                // Make bigger (from left edge)
                result.startColumn = target.column;
                result.endColumn = start.endColumn;

                // Special case if it's a single cell
                if (start.column === start.endColumn) {
                    result.endColumn++;
                }
            }
        }
    }

    if(!onlyHorizontal) {
        if (start.endRow >= target.row + 1 && start.row <= target.row) {
            if (edges.bottom) {
                // Make smaller (from right edge)
                result.startRow = start.row;
                result.endRow = target.row + 1;
            }
            else {
                // Make smaller (from left edge)
                result.startRow = target.row;
                result.endRow = start.endRow;
            }
        }
        else {
            if (edges.bottom) {
                // Make bigger (from right edge)
                result.startRow = start.row;
                result.endRow = target.row + 1;
            }
            else {
                // Make bigger (from left edge)
                result.startRow = target.row;
                result.endRow = start.endRow;

                // Special case if it's a single cell
                if (start.row === start.endRow) {
                    result.endRow++;
                }
            }
        }
    }

    return `${result.startRow} / ${result.startColumn} / ${result.endRow} / ${result.endColumn}`;
}


interact(".cell")
    .draggable({
        inertia: true,
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },

        onmove: dragMoveListener,
        onend(event) {
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
        outer: "parent",
        endOnly: true,
    },

    // minimum size
    restrictSize: {
        min: {width: 100, height: 50},
    },

    inertia: true,
}).on("resizemove", function (event) {
    const module = Application.getModuleById(event.target.id);
    const target = event.target;
    let x = parseFloat(target.dataX || 0) + event.dx;
    let y = parseFloat(target.dataY || 0) + event.dy;
    currentEdges = event.edges;

    // update the element's style
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

    module.area = calculateGridArea(event.target.style.gridArea, element.style.gridArea, currentEdges);
    module.style["transform"] = "";
    Application.layout.saveLayout();
});