require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Quote = require("../../models/quote");

const quoteEdit = require("../../commands/quote-edit");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument;
let commandLink = quoteEdit.command;
const { response } = commandLink.getCommand();

describe("editQuote", () => {
	let index;
	let text;
	let updatedText;
	let cleanUpList = [];

	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await dBCleanUp(cleanUpList);
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndIsModFalse_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!editQuote is for Mods only/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To edit a Quote, use !editQuote [quote number] [quote text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringNotStartsWithQuoteId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "editQuote3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editQuote [quote number] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithQuoteId_AndStringNotHaveQuoteText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		index = "1204";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editQuote [quote number] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithQuoteId_AndStringHasQuoteText_AndQuoteIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		index = "1205";
		updatedText = "5This is editQuoteTest";
		argument = index + " " + updatedText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Quote 1205 found/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithQuoteId_AndStringHasQuoteText_AndQuoteIdInDatabase_AndQuoteTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		index = "1206";
		text = "This is editQuoteTest6";
		updatedText = text;
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[0]).toBe("Quote 1206 already says: This is editQuoteTest6");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithQuoteId_AndStringHasQuoteText_AndQuoteIdInDatabase_AndQuoteTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		index = "1207";
		text = "This is editQuoteTest7";
		updatedText = "7This is editQuoteTest";
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[0]).toBe("Quote 1207 was: This is editQuoteTest7");
		expect(result[1]).toBe(
			"Quote 1207 has been updated to: 7This is editQuoteTest"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To edit a Quote, use !editQuote [quote number] [quote text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNotStartsWithQuoteId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "editQuote9";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editQuote [quote number] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithQuoteId_AndStringNotHaveQuoteText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		index = "1210";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editQuote [quote number] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithQuoteId_AndStringHasQuoteText_AndQuoteIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		index = "1211";
		updatedText = "11This is editQuoteTest";
		argument = index + " " + updatedText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Quote 1211 found/);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithQuoteId_AndStringHasQuoteText_AndQuoteIdInDatabase_AndQuoteTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		index = "1212";
		text = "This is editQuoteTest12";
		updatedText = text;
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[0]).toBe("Quote 1212 already says: This is editQuoteTest12");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithQuoteId_AndStringHasQuoteText_AndQuoteIdInDatabase_AndQuoteTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		index = "1213";
		text = "This is editQuoteTest13";
		updatedText = "13This is editQuoteTest";
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[0]).toBe("Quote 1213 was: This is editQuoteTest13");
		expect(result[1]).toBe(
			"Quote 1213 has been updated to: 13This is editQuoteTest"
		);
	});
});

async function dbSetup(setupIndex, setupText) {
	await Quote.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Quote.deleteMany({ text: { $in: cleanUpQuotes } });
}
