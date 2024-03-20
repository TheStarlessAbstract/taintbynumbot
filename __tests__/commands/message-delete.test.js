require("dotenv").config();
const db = require("../../bot-mongoose.js");

const Message = require("../../models/message");
const messageDelete = require("../../commands/message-delete");

let userInfo;
let argument;
let commandLink = messageDelete.command;
const { response } = commandLink.getCommand();

describe("delMessage", () => {
	let cleanUpList = [];

	beforeAll(async () => {
		db.connectToMongoDB();
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	}, 10000);

	afterAll(async () => {
		await dBCleanUp(cleanUpList);
		await db.disconnectFromMongoDB();
	}, 10000);

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
		expect(result[0]).toMatch(/!delMessage is for Mods only/);
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
		expect(result[0]).toMatch(/To delete a Message use !delMessage/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "test 103";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delMessage [index] - index is a number - !delMessage 69"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringIsNumber_AndMessageIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "104";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("No Message 104 found");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringIsNumber_AndMessageIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "105";

		await dbSetup(105, "This is a test message 105");

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push("This is a test message 105");

		//Assert
		expect(result[0]).toBe(
			"Message deleted - 105 was: This is a test message 105"
		);
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
		expect(result[0]).toMatch(/To delete a Message use !delMessage/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "test 107";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delMessage [index] - index is a number - !delMessage 69"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringIsNumber_AndMessageIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "108";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("No Message 108 found");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringIsNumber_AndMessageIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "109";

		await dbSetup(109, "This is a test message 109");

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Message deleted - 109 was: This is a test message 109"
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
