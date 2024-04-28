const startsWithCaseInsensitive = (string, subString) => {
	let stringLowercase = string.toLowerCase();
	let subStringLowercase = subString.toLowerCase();

	return stringLowercase.startsWith(subStringLowercase);
};

module.exports = startsWithCaseInsensitive;
