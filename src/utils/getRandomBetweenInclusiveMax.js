const isValueNumber = require("./inputCheck/isValueNumber.js");

/**
 * Generates a random integer between a minimum and maximum value, inclusive.
 *
 * @param {number} min - The minimum value for the random number range.
 * @param {number} max - The maximum value for the random number range.
 * @returns {number|undefined} - Random integer between `min` and `max`, inclusive.
 */

const getRandomBetweenInclusiveMax = (min, max) => {
	if (!isValueNumber(min) || !isValueNumber(max) || !(min < max)) return;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = getRandomBetweenInclusiveMax;
