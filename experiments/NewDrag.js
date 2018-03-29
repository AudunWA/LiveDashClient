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
    });

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