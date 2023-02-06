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

test("GetCommandArgumentKey_WhereArgumentIsBool_AndIndexIsZero_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = false;
	//Act
	var value = editQuote.GetCommandArgumentKey(config,0);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsNumber_AndIndexIsZero_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = 1;
	//Act
	var value = editQuote.GetCommandArgumentKey(config,0);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsEmptyString_AndIndexIsZero_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,0);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsValidString_AndIndexIsZero_AndMixedCapitals_ShouldReturnValidStringAllLowerCase", () => {
	//Assemble
	let config = {};
	config.argument = "vAlIdStRiNgNoSpAcEs";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,0);
	//Assert
	expect(value).toBe("validstringnospaces");
});

test("GetCommandArgumentKey_WhereArgumentIsValidString_AndIndexIsZero_AndAllCapitals_ShouldReturnValidStringAllLowerCase", () => {
	//Assemble
	let config = {};
	config.argument = "VALIDSTRINGNOSPACES";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,0);
	//Assert
	expect(value).toBe("validstringnospaces");
});



test("GetCommandArgumentKey_WhereArgumentIsBool_AndIndexIsOne_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = false;
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsNumber_AndIndexIsOne_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = 1;
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsEmptyString_AndIndexIsOne_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndMixedCapitals_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "vAlIdStRiNgNoSpAcEs";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "VALIDSTRINGNOSPACES";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("");
});

test("GetCommandArgumentKey_WhereArgumentIsValidStringWithASpace_AndIndexIsOne_AndMixedCapitals_ShouldReturnSecondPartAsGivenInMixedCaps", () => {
	//Assemble
	let config = {};
	config.argument = "vAlIdStRiNg WithSpAcEs";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("WithSpAcEs");
});

test("GetCommandArgumentKey_WhereArgumentIsValidStringWithNoSpaces_AndIndexIsOne_AndAllCapitals_ShouldReturnSecondPartAsGivenInCaps", () => {
	//Assemble
	let config = {};
	config.argument = "VALIDSTRING WITHSPACES";
	//Act
	var value = editQuote.GetCommandArgumentKey(config,1);
	//Assert
	expect(value).toBe("WITHSPACES");
});





// config.argument.split(/\s(.+)/)[0].toLowerCase();
