const Helper = require("../../classes/helper");
const helper = new Helper();

validversions = [
	{
		description: "Edits an existing quote",
		usage: "!editQuote 69 What in the fuck?",
		usableBy: "mods",
		active: false,
	},
	{
		description:
			"Searches for a quote with this string, returns the index number of the quote, or quotes if multiple. Use above version to edit specific quote",
		usage: "!editQuote sit on my face",
		usableBy: "mods",
		active: true,
	},
];

validUrls = [
	{
		url: "https://test.url/1",
	},
	{
		url: "https://test.url/2",
	},
];

invalidversions = [];

invalidUrls = [];

describe("isVersionActive", () => {
	test("VersionsPackIsEmpty_ShouldReturnFalse", () => {
		//Assemble

		//Act
		let value = helper.isVersionActive(invalidversions, 0);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereIndexIsOutOfBounds_ShouldReturnFalse", () => {
		//Assemble

		//Act
		let value = helper.isVersionActive(validversions, 100);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereIndexIsValid_AndSelectedVersionIsNotActive_ShouldReturnFalse", () => {
		//Act
		let value = helper.isVersionActive(validversions, 0);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereIndexIsValid_AndSelectedVersionIsActive_ShouldReturnTrue", () => {
		//Act
		let value = helper.isVersionActive(validversions, 1);
		//Assert
		expect(value).toBe(true);
	});
});

describe("isValuePresentAndString", () => {
	test("WhereArgumentIsUndefined_ShouldReturnFalse", () => {
		//Assemble
		let input = undefined;
		//Act
		let value = helper.isValuePresentAndString(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsEmptyString_ShouldReturnFalse", () => {
		//Assemble
		let input = "";
		//Act
		let value = helper.isValuePresentAndString(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsNumber_ShouldReturnFalse", () => {
		//Assemble
		let input = 123;
		//Act
		let value = helper.isValuePresentAndString(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsBool_ShouldReturnFalse", () => {
		//Assemble
		let input = false;
		//Act
		let value = helper.isValuePresentAndString(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsValidString_ShouldReturnTrue", () => {
		//Assemble
		let input = "validString";
		//Act
		let value = helper.isValuePresentAndString(input);
		//Assert
		expect(value).toBe(true);
	});
});

describe("isValuePresentAndNumber", () => {
	test("WhereArgumentIsUndefined_ShouldReturnFalse", () => {
		//Assemble
		let input = undefined;
		//Act
		let value = helper.isValuePresentAndNumber(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsString_ShouldReturnTrue", () => {
		//Assemble
		let input = "string";
		//Act
		let value = helper.isValuePresentAndNumber(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsBool_ShouldReturnFalse", () => {
		//Assemble
		let input = false;
		//Act
		let value = helper.isValuePresentAndNumber(input);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereArgumentIsNumber_ShouldReturnFalse", () => {
		//Assemble
		let input = 123;
		//Act
		let value = helper.isValuePresentAndNumber(input);
		//Assert
		expect(value).toBe(true);
	});
});

describe("isValidModeratorOrStreamer", () => {
	test("WhereUserIsNotModerator_AndNotStreamer_ShouldReturnFalse", () => {
		//Assemble
		let config = {};
		config.isMod = false;
		config.isModUp = false;
		config.isBroadcaster = false;
		//Act
		let value = helper.isValidModeratorOrStreamer(config);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereUserIsModerator_AndNotStreamer_ShouldReturnTrue", () => {
		//Assemble
		let config = {};
		config.isMod = true;
		// config.isModUp = true;
		config.isBroadcaster = false;
		//Act
		let value = helper.isValidModeratorOrStreamer(config);
		//Assert
		expect(value).toBe(true);
	});

	test("WhereUserNotModerator_AndIsStreamer_ShouldReturnTrue", () => {
		//Assemble
		let config = {};
		config.isMod = false;
		// config.isModUp = true;
		config.isBroadcaster = true;
		//Act
		let value = helper.isValidModeratorOrStreamer(config);
		//Assert
		expect(value).toBe(true);
	});

	test("WhereUserIsModerator_AndIsStreamer_ShouldReturnTrue", () => {
		//Assemble
		let config = {};
		config.isMod = true;
		// config.isModUp = true;
		config.isBroadcaster = true;
		//Act
		let value = helper.isValidModeratorOrStreamer(config);
		//Assert
		expect(value).toBe(true);
	});
});

describe("getCommandArgumentKey", () => {
	test("WhereArgumentIsBool_AndIndexIsZero_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = false;
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsNumber_AndIndexIsZero_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = 1;
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsEmptyString_AndIndexIsZero_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = "";
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsUndefined_AndIndexIsZero_ShouldReturnNull", () => {
		//Assemble
		let config = {};
		config.argument = undefined;
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe(null);
	});

	test("WhereArgumentIsValidString_AndIndexIsZero_AndMixedCapitals_ShouldReturnValidStringMixedCapitals", () => {
		//Assemble
		let config = {};
		config.argument = "vAlIdStRiNgNoSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe("vAlIdStRiNgNoSpAcEs");
	});

	test("WhereArgumentIsValidString_AndIndexIsZero_AndAllCapitals_ShouldReturnValidStringAllCapitals", () => {
		//Assemble
		let config = {};
		config.argument = "VALIDSTRINGNOSPACES";
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe("VALIDSTRINGNOSPACES");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnFirstPartAsGivenInMixedCaps", () => {
		//Assemble
		let config = {};
		config.argument = "vAlIdStRiNg WithSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe("vAlIdStRiNg");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnNumber", () => {
		//Assemble
		let config = {};
		config.argument = "1 WithSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(config, 0);
		//Assert
		expect(value).toBe(1);
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnFirstPartAsGivenInCaps", () => {
		//Assemble
		let config = {};
		config.argument = "VALIDSTRING WITHSPACES";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("WITHSPACES");
	});

	test("WhereArgumentIsBool_AndIndexIsOne_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = false;
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsNumber_AndIndexIsOne_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = 1;
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsEmptyString_AndIndexIsOne_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = "";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsUndefined_AndIndexIsZero_ShouldReturnNull", () => {
		//Assemble
		let config = {};
		config.argument = undefined;
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe(null);
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndMixedCapitals_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = "vAlIdStRiNgNoSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnEmptyString", () => {
		//Assemble
		let config = {};
		config.argument = "VALIDSTRINGNOSPACES";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnSecondPartAsGivenInMixedCaps", () => {
		//Assemble
		let config = {};
		config.argument = "vAlIdStRiNg WithSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("WithSpAcEs");
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnSecondPartAsGivenInCaps", () => {
		//Assemble
		let config = {};
		config.argument = "VALIDSTRING WITHSPACES";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe("WITHSPACES");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnNumber", () => {
		//Assemble
		let config = {};
		config.argument = "WithSpAcEs 1";
		//Act
		let value = helper.getCommandArgumentKey(config, 1);
		//Assert
		expect(value).toBe(1);
	});
});

describe("isStreamer", () => {
	test("WhereUserIsNotStreamer_ShouldReturnFalse", () => {
		//Assemble
		let config = {};
		config.isBroadcaster = false;
		//Act
		let value = helper.isStreamer(config);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereUserIsStreamer_ShouldReturnTrue", () => {
		//Assemble
		let config = {};
		config.isBroadcaster = true;
		//Act
		let value = helper.isStreamer(config);
		//Assert
		expect(value).toBe(true);
	});
});

describe("isCooldownPassed", () => {
	let newDate = new Date();
	let lastTimeSet;
	let cooldown;
	let value;

	test("WhereCurrentTimeIsANumber_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = 100;
		cooldown = 5000;
		lastTimeSet = new Date(newDate - cooldown);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCurrentTimeIsUndefined_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = undefined;
		cooldown = 5000;
		lastTimeSet = new Date(newDate - cooldown);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCurrentTimeIsString_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = "test";
		cooldown = 5000;
		lastTimeSet = new Date(newDate - cooldown);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCurrentTimeIsObject_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = {};
		cooldown = 5000;
		lastTimeSet = new Date(newDate - cooldown);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCurrentTimeIsNumber_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = 100;
		cooldown = 5000;
		lastTimeSet = new Date(newDate - cooldown);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereLastTimeSetIsNumber_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = 100;

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereLastTimeSetIsUndefined_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = undefined;

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereLastTimeSetIsString_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = "test";

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereLastTimeSetIsObject_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = {};

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCooldownIsNumberLessThanZero_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = -100;
		lastTimeSet = new Date(newDate - 6000);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCooldownIsUndefined_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = undefined;
		lastTimeSet = new Date(newDate - 6000);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCooldownIsString_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = "test";
		lastTimeSet = new Date(newDate - 6000);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCooldownIsObject_ShouldReturnEmptyString", () => {
		//Assemble
		currentTime = newDate;
		cooldown = {};
		lastTimeSet = new Date(newDate - 6000);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe("");
	});

	test("WhereCurrentTimeIsGreaterThanLastSetTime_ByTheCooldownAmount_ShouldReturnFalse", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = new Date(newDate - cooldown);

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentTimeIsGreaterThanLastSetTime_ByLessThanTheCooldownAmount_ShouldReturnFalse", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = new Date(newDate - (cooldown - 1000));

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentTimeIsGreaterThanLastSetTime_ByTheCooldownAmount_ShouldReturntrue", () => {
		//Assemble
		currentTime = newDate;
		cooldown = 5000;
		lastTimeSet = new Date(newDate - (cooldown + 1000));

		//Act
		value = helper.isCooldownPassed(currentTime, lastTimeSet, cooldown);
		//Assert
		expect(value).toBe(true);
	});
});

describe("getRandomisedAudioFileUrl", () => {
	test("ArrayIsEmpty_ShouldReturnEmptyString", () => {
		//Assemble

		//Act
		let value = helper.getRandomisedAudioFileUrl(invalidUrls);
		//Assert
		expect(value).toBe("");
	});

	test("ArrayObjectsContainInvalidStrings_ShouldReturnEmptyString", () => {
		//Assemble
		invalidUrls.push({ url: "test" }, { url: "array" });
		//Act
		let value = helper.getRandomisedAudioFileUrl(invalidUrls);
		//Assert
		expect(value).toBe("");
	});

	test("ArrayIsValid_ShouldReturnTrue", () => {
		//Assemble

		//Act
		let value = helper.getRandomisedAudioFileUrl(validUrls);
		//Assert
		expect(value.startsWith("http")).toBe(true);
	});
});

describe("getRandomBetweenExclusiveMax", () => {
	let min;
	let max;
	let value;

	test("WhereMinIsString_ShouldReturnEmptyString", () => {
		//Assemble
		min = "test";
		max = 100;
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMaxIsString_ShouldReturnEmptyString", () => {
		//Assemble
		min = 1;
		max = "test";
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsUndefined_ShouldReturnEmptyString", () => {
		//Assemble
		min = undefined;
		max = 100;
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMaxIsUndifined_ShouldReturnEmptyString", () => {
		//Assemble
		min = 1;
		max = undefined;
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsGreaterThanMax_ShouldReturnEmptyString", () => {
		//Assemble
		min = 100;
		max = 1;
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsEqualToMax_ShouldReturnEmptyString", () => {
		//Assemble
		min = 100;
		max = 100;
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsLessThanMax_ShouldReturnTrue", () => {
		//Assemble
		min = 1;
		max = 100;
		//Act
		value = helper.getRandomBetweenExclusiveMax(min, max);
		//Assert
		expect(value >= min && value < max).toBe(true);
	});
});

describe("getRandomBetweenInclusiveMax", () => {
	let min;
	let max;
	let value;

	test("WhereMinIsString_ShouldReturnEmptyString", () => {
		//Assemble
		min = "test";
		max = 100;
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMaxIsString_ShouldReturnEmptyString", () => {
		//Assemble
		min = 1;
		max = "test";
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsUndefined_ShouldReturnEmptyString", () => {
		//Assemble
		min = undefined;
		max = 100;
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMaxIsUndifined_ShouldReturnEmptyString", () => {
		//Assemble
		min = 1;
		max = undefined;
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsGreaterThanMax_ShouldReturnEmptyString", () => {
		//Assemble
		min = 100;
		max = 1;
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value).toBe("");
	});

	test("WhereMinIsEqualToMax_ShouldReturnEmptyString", () => {
		//Assemble
		min = 100;
		max = 100;
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value).toBe(100);
	});

	test("WhereMinIsLessThanMax_ShouldReturnTrue", () => {
		//Assemble
		min = 1;
		max = 100;
		//Act
		value = helper.getRandomBetweenInclusiveMax(min, max);
		//Assert
		expect(value >= min && value <= max).toBe(true);
	});
});
