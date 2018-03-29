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
            let element = document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.classList.contains("empty"));

            event.target.style.gridArea = element.style.gridArea;
            event.target.area = element.style.gridArea;
            event.target.style["transform"] = "";

            // update the position attributes
            event.target.dataX = 0;
            event.target.dataY = 0;
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
        const target = event.target;
        let x = parseFloat(target.dataX || 0) + event.dx;
        let y = parseFloat(target.dataY || 0) + event.dy;

        // update the element's style
        // target.style.width = event.rect.width + 'px';
        // target.style.height = event.rect.height + 'px';
        target.style.transformOrigin = calculateTransformOrigin(event.edges);
        target.style.transform =
            "scale(" + event.rect.width / event.target.clientWidth
            + "," +  event.rect.height / event.target.clientHeight;

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        // target.style.transform += ' translate(' + x + 'px,' + y + 'px)';

        target.dataX = x;
        target.dataY = y;
    }).on("resizeend", (event) => {
        let element = document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.classList.contains("empty"));

        event.target.style.gridArea = calculateGridArea(event.target.style.gridArea, element.style.gridArea);
        event.target.style["transform"] = "";
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
function dragMoveListener (event) {
    let target = event.target;

    const x = parseFloat(target.dataX || 0) + event.dx;
    const y = parseFloat(target.dataY || 0) + event.dy;


    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    // update the position attributes
    target.dataX = x;
    target.dataY = y;
}