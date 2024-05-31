const isValueNumber = require("./valueChecks/isValueNumber.js");

const getRandomBetweenExclusiveMax = (min, max) => {
	if (!isValueNumber(min) || !isValueNumber(max) || !(min < max)) return;
	return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = getRandomBetweenExclusiveMax;
