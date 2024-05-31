const splitArgs = (message, sliceValue) => {
	if (!isNonEmptyString(argument)) return;
	const argsArray = message.slice(sliceValue).split(/\s(.+)/);
	for (let i = 0; i < argsArray.length; i++) {
		if (isValueNumber(argsArray[i])) argsArray[i] = Number(argsArray[i]);
	}

	const args = {
		first: argsArray[0],
		second: argsArray[1] || undefined,
	};
	{
		firstArg, secondArg;
	}
	return args;
};

module.exports = splitArgs;
