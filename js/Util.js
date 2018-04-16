Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};

/**
 * Returns a number whose value is limited to the given range.
 * From https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Finds a CSS property value from the :root element in CSS
 * @param propertyName The name of the property
 * @returns {string|null} The value of the property, or null if the property wasn't found
 */
export function getRootCssProperty(propertyName) {
    const style = getComputedStyle(document.body);
    if(style != null) {
        return getComputedStyle(document.body).getPropertyValue(propertyName);
    } else {
        return null;
    }
}