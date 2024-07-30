const { isNonEmptyString, isValueNumber } = require("../../utils/valueChecks");

// sliceValue of 1 to remove prefix from string, 0 if no prefix
const splitArgs = (message, sliceValue) => {
	if (!isNonEmptyString(message)) return;
	const argsArray = message.slice(sliceValue).split(/\s(.+)/);
	for (let i = 0; i < argsArray.length; i++) {
		if (isValueNumber(argsArray[i])) argsArray[i] = Number(argsArray[i]);
	}

	const args = {
		first: argsArray[0],
		second: argsArray[1] || undefined,
	};

	return args;
};

module.exports = splitArgs;
