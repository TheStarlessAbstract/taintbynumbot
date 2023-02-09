const audioTimeout = require("../../commands/audiotimeout");

let validversions = [
	{
		description:
			"Sets audio timeout for bot alerts to default length, or turns off the audio timeout",
		usage: "!audiotimeout",
		usableBy: "mods",
		active: false,
	},
	{
		description: "Sets the audio timeout to the specified amount of seconds",
		usage: "!audiotimeout 3",
		usableBy: "mods",
		active: true,
	},
];

let invalidversions = [];

test("isValidModeratorOrStreamer_WhereUserIsModerator_AndNotStreamer_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.isModUp = true;
	config.isBroadcaster = false;
	//Act
	let value = audioTimeout.isValidModeratorOrStreamer(config);
	//Assert
	expect(value).toBe(true);
});

test("isValidModeratorOrStreamer_WhereUserIsModerator_AndStreamer_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.isModUp = true;
	config.isBroadcaster = true;
	//Act
	let value = audioTimeout.isValidModeratorOrStreamer(config);
	//Assert
	expect(value).toBe(true);
});

test("isValidModeratorOrStreamer_WhereUserIsNotModerator_AndNotStreamer_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.isModUp = false;
	config.isBroadcaster = false;
	//Act
	let value = audioTimeout.isValidModeratorOrStreamer(config);
	//Assert
	expect(value).toBe(false);
});

test("getCommandArgumentKey_WhereArgumentIsBool_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = false;
	//Act
	let value = audioTimeout.getCommandArgumentKey(config);
	//Assert
	expect(value).toBe("");
});

test("getCommandArgumentKey_WhereArgumentIsNumberAsString_ShouldReturnNumber", () => {
	//Assemble
	let config = {};
	config.argument = "1";
	//Act
	let value = audioTimeout.getCommandArgumentKey(config);
	//Assert
	expect(value).toBe(1);
});

test("getCommandArgumentKey_WhereArgumentIsNumber_ShouldReturnNumber", () => {
	//Assemble
	let config = {};
	config.argument = 1;
	//Act
	let value = audioTimeout.getCommandArgumentKey(config);
	//Assert
	expect(value).toBe(1);
});

test("getCommandArgumentKey_WhereArgumentIsEmptyString_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "";
	//Act
	let value = audioTimeout.getCommandArgumentKey(config);
	//Assert
	expect(value).toBe("");
});

test("getCommandArgumentKey_WhereArgumentIsUndefined_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = undefined;
	//Act
	let value = audioTimeout.getCommandArgumentKey(config);
	//Assert
	expect(value).toBe(null);
});

test("getCommandArgumentKey_WhereArgumentIsNotValidString_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "notvalidstring";
	//Act
	let value = audioTimeout.getCommandArgumentKey(config);
	//Assert
	expect(value).toBe("");
});

test("isVersionActive_VersionsPackIsUndefined_ShouldReturnFalse", () => {
	//Assemble

	//Act
	let value = audioTimeout.isVersionActive(undefined, 0);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_VersionsPackIsEmpty_ShouldReturnFalse", () => {
	//Assemble

	//Act
	let value = audioTimeout.isVersionActive(invalidversions, 0);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_WhereIndexIsOutOfBounds_ShouldReturnFalse", () => {
	//Assemble

	//Act
	let value = audioTimeout.isVersionActive(validversions, 100);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_WhereIndexIsValid_AndSelectedVersionIsNotActive_ShouldReturnFalse", () => {
	//Act
	let value = audioTimeout.isVersionActive(validversions, 0);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_WhereIndexIsValid_AndSelectedVersionIsActive_ShouldReturnTrue", () => {
	//Act
	let value = audioTimeout.isVersionActive(validversions, 1);
	//Assert
	expect(value).toBe(true);
});
