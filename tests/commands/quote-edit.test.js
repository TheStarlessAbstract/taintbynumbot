const editQuote = require("../../commands/quote-edit");

const Validversions = [
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

const Invalidversions = [];

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

test("IsValuePresentAndString_WhereArgumentIsUndefined_ShouldReturnFalse", () => {
	//Assemble
	let config = undefined;
	//Act
	var value = editQuote.IsValuePresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("IsValuePresentAndString_WhereArgumentIsEmptyString_ShouldReturnFalse", () => {
	//Assemble
	let config = "";
	//Act
	var value = editQuote.IsValuePresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("IsValuePresentAndString_WhereArgumentIsValidString_ShouldReturnTrue", () => {
	//Assemble
	let config = "validString";
	//Act
	var value = editQuote.IsValuePresentAndString(config);
	//Assert
	expect(value).toBe(true);
});

test("IsValuePresentAndString_WhereArgumentIsNumber_ShouldReturnFalse", () => {
	//Assemble
	let config = 123;
	//Act
	var value = editQuote.IsValuePresentAndString(config);
	//Assert
	expect(value).toBe(false);
});

test("IsValuePresentAndString_WhereArgumentIsBool_ShouldReturnFalse", () => {
	//Assemble
	let config = false;
	//Act
	var value = editQuote.IsValuePresentAndString(config);
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

test("IsVersionActive_VersionsPackIsUndefined_ShouldReturnFalse", () => 
{
	//Assemble
	
	//Act
	var value = editQuote.IsVersionActive(undefined,0);
	//Assert
	expect(value).toBe(false);
});

test("IsVersionActive_VersionsPackIsEmpty_ShouldReturnFalse", () => 
{
	//Assemble
	
	//Act
	var value = editQuote.IsVersionActive(Invalidversions,0);
	//Assert
	expect(value).toBe(false);
});

test("IsVersionActive_WhereIndexIsOutOfBounds_ShouldReturnFalse", () => 
{
	//Assemble
	
	//Act
	var value = editQuote.IsVersionActive(Validversions,100);
	//Assert
	expect(value).toBe(false);
});

test("IsVersionActive_WhereIndexIsValid_AndSelectedVersionIsNotActive_ShouldReturnFalse", () => 
{
	//Act
	var value = editQuote.IsVersionActive(Validversions,0);
	//Assert
	expect(value).toBe(false);
});

test("IsVersionActive_WhereIndexIsValid_AndSelectedVersionIsActive_ShouldReturnTrue", () => 
{
	//Act
	var value = editQuote.IsVersionActive(Validversions,1);
	//Assert
	expect(value).toBe(true);
});

test("GetQuoteForKey_WhereIndexIsValid_AndSelectedVersionIsActive_ShouldReturnTrue", () => 
{
	//Act
	var value = editQuote.GetQuoteForKey("f");
	//Assert
	expect(value).toBe(true);
});



//return versions[index].active;
