const isNonEmptyString = (value) => {
	return typeof value === "string" && value.trim() !== "";
};

module.exports = isNonEmptyString;
