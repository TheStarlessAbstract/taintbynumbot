/**
 * Checks if a given value is a number.
 * @param {number} value - The value to be checked.
 * @returns {boolean} - True if the value is a number, false otherwise.
 */
const isValueNumber = (value) => {
	return !isNaN(value);
};

module.exports = isValueNumber;
