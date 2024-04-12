const { isValueNumber } = require("./utils");

const diceRoll = (max) => {
	if (!isValueNumber(max)) return;

	return Math.floor(Math.random() * (max - 1 + 1)) + 1;
};

module.exports = diceRoll;
