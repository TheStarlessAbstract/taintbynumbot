require("dotenv").config();
const db = require("../../bot-mongoose.js");

const Message = require("../../models/message");
const messageDelete = require("../../commands/message-delete");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = messageDelete.command;
const { response } = commandLink.getCommand();

describe.skip("delMessage", () => {
	let cleanUpList = [];

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
		isBroadcaster = false;
		isMod = false;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!delMessage is for Mods only/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = {};

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To delete a Message use !delMessage/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndIdNotNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "test 103";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delMessage [index] - index is a number - !delMessage 69"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndIdIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "104";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("No Message 104 found");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndIdIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "105";

		await dbSetup(105, "This is a test message 105");

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push("This is a test message 105");

		//Assert
		expect(result[0]).toBe(
			"Message deleted - 105 was: This is a test message 105"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = {};

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To delete a Message use !delMessage/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndIdNotNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "test 107";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delMessage [index] - index is a number - !delMessage 69"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndIdIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "108";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("No Message 108 found");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndIdIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "109";

		await dbSetup(109, "This is a test message 109");

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Message deleted - 109 was: This is a test message 109"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = {};

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To delete a Message use !delMessage/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndIdNotNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "test 111";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delMessage [index] - index is a number - !delMessage 69"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndIdIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "112";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("No Message 112 found");
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndIdIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "113";

		await dbSetup(113, "This is a test message 113");

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Message deleted - 113 was: This is a test message 113"
		);
	});
});

async function dbSetup(index, setupMessage) {
	await Message.create({
		index: index,
		text: setupMessage,
	});
}

async function dBCleanUp(cleanUpMessages) {
	await Message.deleteMany({ text: { $in: cleanUpMessages } });
}
