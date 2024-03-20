require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Tinder = require("../../models/tinder");
const tinderDelete = require("../../commands/tinder-delete");

let userInfo;
let argument;
let commandLink = tinderDelete.command;
const { response } = commandLink.getCommand();

describe("delModAbuse", () => {
	let cleanUpList = [];
	let bio;

	beforeAll(async () => {
		db.connectToMongoDB();

		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	});

	afterAll(async () => {
		await dBCleanUp(cleanUpList);
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!delTinder is for Mods only/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To delete a Tinder bio, use !delTinder [bio number]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "delTinderTest3";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!delTinder [bio number] - !delTinder 69");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringIsNumber_AndIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "1004";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Tinder bio 1004 found/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringIsNumber_AndIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		bio = "This is tinderTest5";
		argument = "1005";

		await dbSetup(argument, bio);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(bio);

		//Assert
		expect(result[0]).toMatch(/Tinder bio deleted - 1005 was: /);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To delete a Tinder bio, use !delTinder [bio number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "delAbuseTest7";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!delTinder [bio number] - !delTinder 69");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringIsNumber_AndIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "1008";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Tinder bio 1008 found/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringIsNumber_AndIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		bio = "This is delTinderTest9";
		argument = "1009";

		await dbSetup(argument, bio);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(bio);

		//Assert
		expect(result[0]).toMatch(/Tinder bio deleted - 1009 was: /);
	});
});

async function dbSetup(index, setupText) {
	await Tinder.create({
		index: index,
		text: setupText,
	});
}

async function dBCleanUp(cleanUpMessages) {
	await Tinder.deleteMany({ text: { $in: cleanUpMessages } });
}
