require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Tinder = require("../../models/tinder");

const tinderAdd = require("../../commands/tinder-add");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument;
let commandLink = tinderAdd.command;
const { response } = commandLink.getCommand();

describe.skip("addTinder", () => {
	let cleanUpList = [];

	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await dBCleanUp(cleanUpList);
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndAndIsModFalse_ShouldReturnString", async () => {
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
		expect(result[0]).toMatch(/!addTinder is for Mods only/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toBe("To add a Tinder bio use !addTinder [tinder bio]");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is test addTinder3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/New Tinder bio added: This is test addTinder3/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is test addTinder4";

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
		expect(result[0]).toMatch(/This Tinder bio has already been added/);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toBe("To add a Tinder bio use !addTinder [tinder bio]");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "This is test addTinder6";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/Tinder bio added: This is test addTinder6/);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "This is test addTinder7";

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
		expect(result[0]).toMatch(/This Tinder bio has already been added/);
	});
});

async function dbSetup(setupIndex, setupText) {
	await Tinder.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Tinder.deleteMany({ text: { $in: cleanUpQuotes } });
}
