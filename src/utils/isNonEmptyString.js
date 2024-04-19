/**
 * Checks if a given value is a non-empty string.
 * @param {any} value - The value to be checked.
 * @returns {boolean} - True if the value is a non-empty string, false otherwise.
 */
const isNonEmptyString = (value) => {
	return typeof value === "string" && value.trim() !== "";
};

module.exports = isNonEmptyString;
