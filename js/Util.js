Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};

export function getFirstIdFromParents(node) {
    let currentNode = node;
    while(currentNode.id.length === 0) {
        currentNode = currentNode.parentNode;
    }
    return currentNode.id;
}