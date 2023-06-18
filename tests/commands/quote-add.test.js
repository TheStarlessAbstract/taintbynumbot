require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Quote = require("../../models/quote");

const quoteAdd = require("../../commands/quote-add");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument;
let commandLink = quoteAdd.command;
const { response } = commandLink.getCommand();

describe.skip("addQuote", () => {
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
		expect(result[0]).toMatch(/!addQuote is for Mods only/);
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
		expect(result[0]).toBe("To add a Quote use !addQuote [quote text]");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndQuoteNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is test addQuote3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/Quote added: This is test addQuote3/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndQuoteInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is test addQuote4";

		await dbSetup(1004, argument);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This Quote has already been added/);
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
		expect(result[0]).toBe("To add a Quote use !addQuote [quote text]");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndQuoteNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "This is test addQuote6";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/Quote added: This is test addQuote6/);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndQuoteInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "This is test addQuote7";

		await dbSetup(1007, argument);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This Quote has already been added/);
	});
});

async function dbSetup(setupIndex, setupText) {
	await Quote.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Quote.deleteMany({ text: { $in: cleanUpQuotes } });
}
