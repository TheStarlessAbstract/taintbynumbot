require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Quote = require("../../models/quote");

const quoteDelete = require("../../commands/quote-delete");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument;
let commandLink = quoteDelete.command;
const { response } = commandLink.getCommand();

describe.skip("delQuote", () => {
	let cleanUpList = [];
	let index;
	let quote;

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
		expect(result[0]).toMatch(/!delQuote is for Mods only/);
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
		expect(result[0]).toBe("To delete a Quote, use !delQuote [quote number]");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "delQuote03";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("To delete a Quote, use !delQuote [quote number]");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringIsNumber_AndQuoteNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		index = "1104";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Quote 1104 found/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringIsNumber_AndQuoteInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		index = "1105";
		quote = "This is test delQuote05";
		argument = index;

		await dbSetup(index, quote);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(quote);

		//Assert
		expect(result[0]).toMatch(/Quote 1105 was: This is test delQuote05/);
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
		expect(result[0]).toBe("To delete a Quote, use !delQuote [quote number]");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "delQuote07";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("To delete a Quote, use !delQuote [quote number]");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringIsNumber_AndQuoteNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		index = "1108";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Quote 1108 found/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringIsNumber_AndQuoteInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		index = "1109";
		quote = "This is test delQuote09";
		argument = index;

		await dbSetup(index, quote);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(quote);

		//Assert
		expect(result[0]).toMatch(/Quote 1109 was: This is test delQuote09/);
	});
});

async function dbSetup(setupIndex, setupText) {
	await Quote.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Quote.deleteMany({ text: { $in: cleanUpQuotes } });
}
