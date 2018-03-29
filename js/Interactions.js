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
    });

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