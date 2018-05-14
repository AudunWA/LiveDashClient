/**
 * Compute the linear interpolation of 2 values, with an amount
 * From https://gist.github.com/demonixis/4202528/5f0ce3c2622fba580e78189cfe3ff0f9dd8aefcc
 * @param value1 The first value
 * @param value2 The second value
 * @param amount How much to interpolate (between 0 and 1)
 * @returns {Number} The result of the linear interpolation
 */
export function lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}

/**
 * Returns a number whose value is limited to the given range.
 * From https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp(x*255, 0, 255)
 *
 * @param {Number} value The number to clamp
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns {Number} A number in the range [min, max]
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

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