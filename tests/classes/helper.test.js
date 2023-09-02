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

emptyArray = [];

validUnshuffledArray = [
	{
		suit: "Clubs",
		value: "Ace",
		rule: "Musketeers: All for one and one for all",
		explanation: "Everybody drinks",
	},
	{
		suit: "Clubs",
		value: "2",
		rule: "Fuck you!",
		explanation:
			"Choose someone to take a drink...but fuck Starless mainly amirite?!",
	},

	{
		suit: "Clubs",
		value: "3",
		rule: "Fuck me!",
		explanation: "You drew this card, so you drink!",
	},
	{
		suit: "Clubs",
		value: "4",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Clubs",
		value: "5",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Clubs",
		value: "6",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Clubs",
		value: "7",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},
	{
		suit: "Clubs",
		value: "8",
		rule: "Pick a mate!",
		explanation:
			"You and a person of your choosing takes a drink...tell us why it is St…",
	},

	{
		suit: "Clubs",
		value: "9",
		rule: "Bust a rhyme!",
		explanation:
			"Quickfire rhyming between you and Starless, whoever takes too long has…",
	},

	{
		suit: "Clubs",
		value: "10",
		rule: "Make a rule!",
		explanation:
			"You get to make a rule for Starless, and maybe chat. Rule last until t…",
	},
	{
		suit: "Clubs",
		value: "Jack",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Clubs",
		value: "Queen",
		rule: "Ask a question!",
		explanation:
			"Ask Starless a general knowledge question. Starless gets it right, you…",
	},

	{
		suit: "Clubs",
		value: "King",
		rule: "Kings!",
		explanation:
			"The first three Kings drawn mean nothing, Starless may offer a sympath…",
	},

	{
		suit: "Diamonds",
		value: "Ace",
		rule: "Musketeers: All for one and one for all",
		explanation: "Everybody drinks",
	},

	{
		suit: "Diamonds",
		value: "2",
		rule: "Fuck you!",
		explanation:
			"Choose someone to take a drink...but fuck Starless mainly amirite?!",
	},

	{
		suit: "Diamonds",
		value: "3",
		rule: "Fuck me!",
		explanation: "You drew this card, so you drink!",
	},

	{
		suit: "Diamonds",
		value: "4",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Diamonds",
		value: "5",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Diamonds",
		value: "6",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Diamonds",
		value: "7",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Diamonds",
		value: "8",
		rule: "Pick a mate!",
		explanation:
			"You and a person of your choosing takes a drink...tell us why it is St…",
	},

	{
		suit: "Diamonds",
		value: "9",
		rule: "Bust a rhyme!",
		explanation:
			"Quickfire rhyming between you and Starless, whoever takes too long has…",
	},

	{
		suit: "Diamonds",
		value: "10",
		rule: "Make a rule!",
		explanation:
			"You get to make a rule for Starless, and maybe chat. Rule last until t…",
	},

	{
		suit: "Diamonds",
		value: "Jack",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},

	{
		suit: "Diamonds",
		value: "Queen",
		rule: "Ask a question!",
		explanation:
			"Ask Starless a general knowledge question. Starless gets it right, you…",
	},

	{
		suit: "Diamonds",
		value: "King",
		rule: "Kings!",
		explanation:
			"The first three Kings drawn mean nothing, Starless may offer a sympath…",
	},
];

validNextIndices = [
	{
		index: 3,
	},
	{
		index: 2,
	},
	{
		index: 10,
	},
	{
		index: 1,
	},
	{
		index: 7,
	},
];

invalidNextIndices = [
	{
		name: 3,
	},
	{
		name: 2,
	},
	{
		name: 10,
	},
	{
		name: 1,
	},
	{
		name: 7,
	},
];

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

describe("getCommandArgumentKey", () => {
	test("WhereArgumentIsBool_AndIndexIsZero_ShouldReturnEmptyString", () => {
		//Assemble
		argument = false;
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsNumber_AndIndexIsZero_ShouldReturnEmptyString", () => {
		//Assemble
		argument = 1;
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsEmptyString_AndIndexIsZero_ShouldReturnEmptyString", () => {
		//Assemble
		argument = "";
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsUndefined_AndIndexIsZero_ShouldReturnNull", () => {
		//Assemble
		argument = undefined;
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe(null);
	});

	test("WhereArgumentIsValidString_AndIndexIsZero_AndMixedCapitals_ShouldReturnValidStringMixedCapitals", () => {
		//Assemble
		argument = "vAlIdStRiNgNoSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe("vAlIdStRiNgNoSpAcEs");
	});

	test("WhereArgumentIsValidString_AndIndexIsZero_AndAllCapitals_ShouldReturnValidStringAllCapitals", () => {
		//Assemble
		argument = "VALIDSTRINGNOSPACES";
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe("VALIDSTRINGNOSPACES");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnFirstPartAsGivenInMixedCaps", () => {
		//Assemble
		argument = "vAlIdStRiNg WithSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe("vAlIdStRiNg");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsZero_AndMixedCapitals_ShouldReturnNumber", () => {
		//Assemble
		argument = "1 WithSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(argument, 0);
		//Assert
		expect(value).toBe(1);
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnFirstPartAsGivenInCaps", () => {
		//Assemble
		argument = "VALIDSTRING WITHSPACES";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("WITHSPACES");
	});

	test("WhereArgumentIsBool_AndIndexIsOne_ShouldReturnEmptyString", () => {
		//Assemble
		argument = false;
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsNumber_AndIndexIsOne_ShouldReturnEmptyString", () => {
		//Assemble
		argument = 1;
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsEmptyString_AndIndexIsOne_ShouldReturnEmptyString", () => {
		//Assemble
		argument = "";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsUndefined_AndIndexIsOne_ShouldReturnNull", () => {
		//Assemble
		argument = undefined;
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe(null);
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndMixedCapitals_ShouldReturnEmptyString", () => {
		//Assemble
		argument = "vAlIdStRiNgNoSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnEmptyString", () => {
		//Assemble
		argument = "VALIDSTRINGNOSPACES";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnSecondPartAsGivenInMixedCaps", () => {
		//Assemble
		argument = "vAlIdStRiNg WithSpAcEs";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("WithSpAcEs");
	});

	test("WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnSecondPartAsGivenInCaps", () => {
		//Assemble
		argument = "VALIDSTRING WITHSPACES";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe("WITHSPACES");
	});

	test("WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnNumber", () => {
		//Assemble
		argument = "WithSpAcEs 1";
		//Act
		let value = helper.getCommandArgumentKey(argument, 1);
		//Assert
		expect(value).toBe(1);
	});
});

describe("getNextIndex", () => {
	beforeAll(async () => {
		// emptyArray = undefined;
	});

	test("ArrayIsEmpty_ShouldReturnEmptyString", () => {
		//Assemble

		//Act
		let value = helper.getNextIndex(emptyArray);
		//Assert
		expect(value).toBe("");
	});

	test("ArrayIsUndefinded_ShouldReturnEmptyString", () => {
		//Assemble
		emptyArray = undefined;

		//Act
		let value = helper.getNextIndex(emptyArray);
		//Assert
		expect(value).toBe("");
	});

	test("ArrayIsString_ShouldReturnEmtyString", () => {
		//Assemble

		//Act
		let value = helper.getNextIndex("string");

		//Assert

		expect(value).toBe("");
	});

	test("ArrayIsValid_ShouldReturnString", () => {
		//Assemble

		//Act
		nextIndex = helper.getNextIndex(validNextIndices);

		//Assert
		expect(nextIndex).toBe(11);
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

describe("shuffle", () => {
	beforeAll(async () => {
		emptyArray = undefined;
	});

	test("ArrayIsEmpty_ShouldReturnEmptyString", () => {
		//Assemble

		//Act
		let value = helper.shuffle(emptyArray);
		//Assert
		expect(value).toBe("");
	});

	test("ArrayIsUndefinded_ShouldReturnEmptyString", () => {
		//Assemble
		emptyArray = undefined;

		//Act
		let value = helper.shuffle(emptyArray);
		//Assert
		expect(value).toBe("");
	});

	test("ArrayIsString_ShouldReturnEmtyString", () => {
		//Assemble

		//Act
		let value = helper.shuffle("string");

		//Assert

		expect(value).toBe("");
	});

	test("ArrayIsValid_ShouldReturnString", () => {
		//Assemble
		let shuffled = false;

		//Act
		let shuffledArray = helper.shuffle(validUnshuffledArray);

		//Assert
		for (let i = 0; i < validUnshuffledArray.length; i++) {
			for (let j = 0; j < shuffledArray.length; j++) {
				if (
					validUnshuffledArray[i].suit != shuffledArray[j].suit &&
					validUnshuffledArray[i].value != shuffledArray[j].value
				) {
					shuffled = true;
					break;
				}
			}
		}

		expect(shuffled).toBe(true);
	});
});

describe("startsWithCaseInsensitive", () => {
	// beforeAll(async () => {
	// 	emptyArray = undefined;
	// });

	test("ArrayIsEmpty_ShouldReturnEmptyString", () => {
		//Assemble

		//Act
		let value = helper.shuffle(emptyArray);
		//Assert
		expect(value).toBe("");
	});
});
