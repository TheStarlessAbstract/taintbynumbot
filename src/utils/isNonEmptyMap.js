/**
 * Checks if a given value is a non-empty Map instance.
 * @param {*} value - The value to be checked.
 * @returns {boolean} - True if the value is a non-empty Map instance, false otherwise.
 */
const isNonEmptyMap = (value) => {
	return value instanceof Map && value.size > 0;
};

module.exports = isNonEmptyMap;
