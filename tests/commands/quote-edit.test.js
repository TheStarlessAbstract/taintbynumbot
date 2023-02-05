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

test("IsArgumentPresentAndString_WhereArgumentIsUndefined_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = undefined;
	//Act
	var value = editQuote.IsArgumentPresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresentAndString_WhereArgumentIsEmptyString_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = "";
	//Act
	var value = editQuote.IsArgumentPresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresentAndString_WhereArgumentIsValidString_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.argument = "validString";
	//Act
	var value = editQuote.IsArgumentPresentAndString(config);
	//Assert
	expect(value).toBe(true);
});

test("IsArgumentPresentAndString_WhereArgumentIsNumber_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = 123;
	//Act
	var value = editQuote.IsArgumentPresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("IsArgumentPresentAndString_WhereArgumentIsBool_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.argument = false;
	//Act
	var value = editQuote.IsArgumentPresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("GetCommandArgumentKey_WhereArgumentIsBool_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = false;
	//Act
	var value = editQuote.GetCommandArgumentKey(config);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsNumber_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = 1;
	//Act
	var value = editQuote.GetCommandArgumentKey(config);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsEmptyString_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "";
	//Act
	var value = editQuote.GetCommandArgumentKey(config);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsValidString_AndMixedCapitals_ShouldReturnValidStringAllLowerCase", () => {
	//Assemble
	let config = {};
	config.argument = "vAlIdStRiNgNoSpAcEs";
	//Act
	var value = editQuote.GetCommandArgumentKey(config);
	//Assert
	expect(value).toBe("validstringnospaces");
});

test("GetCommandArgumentKey_WhereArgumentIsValidString_AndAllCapitals_ShouldReturnValidStringAllLowerCase", () => {
	//Assemble
	let config = {};
	config.argument = "VALIDSTRINGNOSPACES";
	//Act
	var value = editQuote.GetCommandArgumentKey(config);
	//Assert
	expect(value).toBe("validstringnospaces");
});





// config.argument.split(/\s(.+)/)[0].toLowerCase();
