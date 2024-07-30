const isValueNumber = require("./valueChecks/isValueNumber.js");

const getRandomBetweenInclusiveMax = (min, max) => {
	if (!isValueNumber(min) || !isValueNumber(max) || !(min <= max)) return;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = getRandomBetweenInclusiveMax;
