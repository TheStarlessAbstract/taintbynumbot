const editQuote = require("../../commands/quote-edit");

test("IsValidModeratorOrStreamer_WhereUserIsModerator_AndNotStreamer_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.isModUp = true;
	config.isBroadcaster = false;
	//Act
	var value = editQuote.IsValidModeratorOrStreamer(config);
	//Assert
	expect(value).toBe(true);
});

test("IsValidModeratorOrStreamer_WhereUserIsModerator_AndStreamer_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.isModUp = true;
	config.isBroadcaster = true;
	//Act
	var value = editQuote.IsValidModeratorOrStreamer(config);
	//Assert
	expect(value).toBe(true);
});

test("IsValidModeratorOrStreamer_WhereUserIsNotModerator_AndNotStreamer_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.isModUp = false;
	config.isBroadcaster = false;
	//Act
	var value = editQuote.IsValidModeratorOrStreamer(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresent_WhereArgumentIsUndefined_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = undefined;
	//Act
	var value = editQuote.IsArgumentPresent(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresent_WhereArgumentIsEmptyString_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = "";
	//Act
	var value = editQuote.IsArgumentPresent(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresent_WhereArgumentIsValidString_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.argument = "validString";
	//Act
	var value = editQuote.IsArgumentPresent(config);
	//Assert
	expect(value).toBe(true);
});

test("IsArgumentPresent_WhereArgumentIsNumber_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = 123;
	//Act
	var value = editQuote.IsArgumentPresent(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresent_WhereArgumentIsBool_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = false;
	//Act
	var value = editQuote.IsArgumentPresent(config);
	//Assert
	expect(value).toBe(false);
});
