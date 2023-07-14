require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Tinder = require("../../models/tinder");

const tinderEdit = require("../../commands/tinder-edit");

let userInfo = {};
let argument;
let commandLink = tinderEdit.command;
const { response } = commandLink.getCommand();

describe("editTinder", () => {
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

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: false };
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!editTinder is for Mods only/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To edit a Tinder bio, use !editTinder [bio number] [updated bio]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNotStartsWithId_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		argument = "editTinder3";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editTinder [bio number] [updated bio] - !editTinder 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithId_AndStringNotHaveText_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		index = "1204";
		argument = index;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editTinder [bio number] [updated bio] - !editTinder 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithId_AndStringHasText_AndIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		index = "1205";
		updatedText = "5This is editTinderTest";
		argument = index + " " + updatedText;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Tinder bio 1205 found/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithId_AndStringHasText_AndIdInDatabase_AndTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		index = "1206";
		text = "This is editTinderTest6";
		updatedText = text;
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[0]).toBe("Tinder bio 1206 already says: ");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithId_AndStringHasText_AndIdInDatabase_AndTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		index = "1207";
		text = "This is editTinderTest7";
		updatedText = "7This is editTinderTest";
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[2]).toBe("Tinder bio 1207 has been updated.");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To edit a Tinder bio, use !editTinder [bio number] [updated bio]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNotStartsWithId_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		argument = "editTinder9";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editTinder [bio number] [updated bio] - !editTinder 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithId_AndStringNotHaveText_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		index = "1210";
		argument = index;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editTinder [bio number] [updated bio] - !editTinder 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithId_AndStringHasText_AndIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		index = "1211";
		updatedText = "11This is editTinderTest";
		argument = index + " " + updatedText;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Tinder bio 1211 found/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithId_AndStringHasText_AndIdInDatabase_AndTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		index = "1212";
		text = "This is editTinderTest12";
		updatedText = text;
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[0]).toBe("Tinder bio 1212 already says: ");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithId_AndStringHasText_AndIdInDatabase_AndTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		index = "1213";
		text = "This is editTinderTest13";
		updatedText = "13This is editTinderTest";
		argument = index + " " + updatedText;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(updatedText);

		//Assert
		expect(result[2]).toBe("Tinder bio 1213 has been updated.");
	});
});

async function dbSetup(setupIndex, setupText) {
	await Tinder.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Tinder.deleteMany({ text: { $in: cleanUpQuotes } });
}
