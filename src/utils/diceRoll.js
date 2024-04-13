const isValueNumber = require("./isValueNumber.js");

/**
 * Generates a random number between 1 and a given maximum value.
 * @param {number} max - The maximum value for the random number generation.
 * @returns {number} - A random number between 1 and the given maximum value.
 */
const diceRoll = (max) => {
	if (!isValueNumber(max) || max <= 1) return;
	const min = 1;

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = diceRoll;
