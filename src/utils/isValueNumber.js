const isValueNumber = (value) => {
	return (
		!isNaN(value) && (typeof value === "number" || !isNaN(parseFloat(value)))
	);
};

module.exports = isValueNumber;
