import Application from "./Application.js";

/**
 * Specifies which corners that are selected in a resize operation
 */
let currentEdges = null;

/**
 * Specifies the offset (cell count in x and y) between the upper-left cell and the cell that the pointer is dragging a module with
 */
let currentDragOffset = null;

/**
 * Returns the correct transform-origin CSS property for a resize operation
 * @param edges An object which defines the edges which are being dragged
 * @returns {string} The correct transform origin
 */
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

/**
 * Calculate which grid area a module should cover after a resize operation
 * @param oldArea The initial/old area of the module
 * @param newArea The area which the pointer was inside when ending the resize operation
 * @param edges The edges which was dragged
 * @returns {string} The new grid area for the module
 */
function calculateGridArea(oldArea, newArea, edges) {
    const onlyVertical = ((edges.top || edges.bottom) && !(edges.left || edges.right));
    const onlyHorizontal = ((edges.left || edges.right) && !(edges.top || edges.bottom));

    let start = objectifyGridArea(oldArea);
    let target = objectifyGridArea(newArea);
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

/**
 * Gets the amount of cells a given grid area covers (in both x and y direction)
 * @param gridArea The grid area to check
 * @returns {{width: number, height: number}} An object specifying the width and height of the cell
 */
function getWidthAndHeight(gridArea) {
    const area = objectifyGridArea(gridArea);
    return {
        width: Math.max(1, area.endColumn - area.column),
        height: Math.max(1, area.endRow - area.row)
    };
}

/**
 * Calculates a grid area for a module, from the top-left grid area and the width and height
 * @param dimensions The width and height
 * @param gridArea The grid area of the top-left cell of the module
 * @returns {string} The new grid area for the module
 */
function applyDimensionsAtPosition(dimensions, gridArea) {
    const area = objectifyGridArea(gridArea);
    return `${area.row} / ${area.column} / ${area.row + dimensions.height} / ${area.column + dimensions.width}`;
}

/**
 * Converts a grid area to an object containing the same information
 * @param gridArea The grid area
 * @returns {{row: number, column: number, endRow: number, endColumn: number}} The grid area in object form
 */
function objectifyGridArea(gridArea) {
    const gridAreaSplit = gridArea.split(" / ");

    return {
        row: parseInt(gridAreaSplit[0]),
        column: parseInt(gridAreaSplit[1]),
        endRow: parseInt(gridAreaSplit[2]),
        endColumn: parseInt(gridAreaSplit[3])
    };
}

/**
 * Converts an object representation of a grid area back to a CSS property value
 * @param area The grid area object
 * @returns {string} A grid-area CSS property value
 */
function deobjectifyArea(area) {
    return `${area.row} / ${area.column} / ${area.endRow} / ${area.endColumn}`;
}

/**
 * Calculates the offset (cell count in x and y) between the upper-left cell and the cell that the pointer is dragging a module with
 * @param moduleGridArea The upper-elft cell grid area
 * @param dragGridArea The grid area of the cell that the pointer is above
 * @returns {{x: number, y: number}} The offset as cell count in x and y direction
 */
function calculateDragOffset(moduleGridArea, dragGridArea) {
    const moduleArea = objectifyGridArea(moduleGridArea);
    const dragArea = objectifyGridArea(dragGridArea);

    return {
        x: dragArea.column - moduleArea.column,
        y: dragArea.row - moduleArea.row
    };
}

// interact.margin(5);

/**
 * Ensures that a module is inside the defined grid.
 * @param {string} newArea The area to clamp
 * @param {number} rows The amount of rows in the grid
 * @param {number} columns The amount of columns in the grid
 * @returns {string} The clamped grid area
 */
function clampGridArea(newArea, rows, columns) {
    const area = objectifyGridArea(newArea);
    const dimension = getWidthAndHeight(newArea);
    if(area.endRow > rows + 1) {
        area.row = rows - dimension.height + 1;
        area.endRow = rows;
    } else if (area.row <= 1) {
        area.row = 1;
        area.endRow = dimension.height;
    }

    if(area.endColumn > columns + 1) {
        area.column = columns - dimension.width + 1;
        area.endColumn = columns;
    } else if (area.column < 1) {
        area.column = 1;
        area.endColumn = dimension.width;
    }
    return deobjectifyArea(area);
}

interact(".edit")
    .draggable({
        inertia: true,
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onstart(event) {
            const emptyCellElement = document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.classList.contains("empty"));
            const module = Application.getModuleById(event.target.id);

            const gridArea = emptyCellElement.style.gridArea;
            const moduleGridArea = module.area;
            currentDragOffset = calculateDragOffset(moduleGridArea, gridArea);

        },
        onmove(event) {
            const module = Application.getModuleById(event.target.id);

            const x = parseFloat(event.target.dataX || 0) + event.dx;
            const y = parseFloat(event.target.dataY || 0) + event.dy;


            // Translate the element
            event.target.style.transform = "translate(" + x + "px, " + y + "px)";
            module.style.transform = "translate(" + x + "px, " + y + "px)";

            // Update the posiion attributes
            event.target.dataX = x;
            event.target.dataY = y;
        },
        onend(event) {
            const emptyCellElement = document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.classList.contains("empty"));
            const module = Application.getModuleById(event.target.id);

            const dimensions = getWidthAndHeight(module.area);
            let emptyCelLGridAreaAdjusted = objectifyGridArea(emptyCellElement.style.gridArea);
            emptyCelLGridAreaAdjusted.column -= currentDragOffset.x;
            emptyCelLGridAreaAdjusted.endColumn -= currentDragOffset.x;
            emptyCelLGridAreaAdjusted.row -= currentDragOffset.y;
            emptyCelLGridAreaAdjusted.endRow -= currentDragOffset.y;
            // Fix the position
            let newArea = applyDimensionsAtPosition(dimensions, deobjectifyArea(emptyCelLGridAreaAdjusted));
            newArea = clampGridArea(newArea, Application.layout.rows, Application.layout.columns);
            module.area = newArea;
            module.style["transform"] = "";
            event.target.dataX = 0;
            event.target.dataY = 0;

            Application.layout.saveLayout();
        }
    }).resizable({
        // margin: 5,

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

        if(element == null) {
            module.style["transform"] = "";
            return;
        }
        module.area = calculateGridArea(event.target.style.gridArea, element.style.gridArea, currentEdges);
        module.style["transform"] = "";
        Application.layout.saveLayout();
    });