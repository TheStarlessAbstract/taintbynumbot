const isCooldownPassed = (currentTime, lastTimeSet, currentCooldown) => {
	if (
		currentTime instanceof Date &&
		lastTimeSet instanceof Date &&
		this.isValuePresentAndNumber(currentCooldown) &&
		currentCooldown >= 0
	) {
		return currentTime - lastTimeSet > currentCooldown;
	}

	return "";
};

module.exports = isCooldownPassed;
