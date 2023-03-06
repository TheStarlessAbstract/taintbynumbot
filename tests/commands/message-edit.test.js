require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Helper = require("../../classes/helper");

const Message = require("../../models/message");
const messageEdit = require("../../commands/message-edit");

const helper = new Helper();

let isBroadcaster;
let isMod;
let userInfo;
let messageIndex;
let messageText;
let updatedMessageText;
let argument;
let commandLink = messageEdit.command;
const { response } = commandLink.getCommand();

describe.skip("editMessage", () => {
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
		expect(result[0]).toMatch(/!editMessage is for Mods only/);
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
		expect(result[0]).toMatch(/To edit a Message use !editMessage/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndNoId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "";
		messageText = "";
		updatedMessageText = "3This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To edit a Message, you must include the index/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndNoText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1004";
		messageText = "";
		updatedMessageText = "";
		argument = messageIndex + " " + updatedMessageText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/To edit a Message, you must include the updated text/
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndHasText_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1005";
		messageText = "This is editMessageTest5";
		updatedMessageText = "5This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Message number 1005 found/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndHasText_AndInDatabase_AndTextNotIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1006";
		messageText = "This is editMessageTest6";
		updatedMessageText = "This is editMessageTest6";
		argument = messageIndex + " " + updatedMessageText;

		await dbSetup(messageIndex, messageText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(messageIndex);

		//Assert
		expect(result[0]).toMatch(/Message 1006 already says:/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndHasText_AndInDatabase_AndTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1007";
		messageText = "This is editMessageTest7";
		updatedMessageText = "7This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		await dbSetup(messageIndex, messageText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(messageIndex);

		//Assert
		expect(result[0]).toMatch(/Message 1007 was: This is editMessageTest7/);
		expect(result[1]).toMatch(
			/Message 1007 has been updated to: 7This is editMessageTest/
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
		expect(result[0]).toMatch(/To edit a Message use !editMessage/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndNoId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "This is editMessageTest9";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To edit a Message, you must include the index/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndHasId_AndNoText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "1010";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/To edit a Message, you must include the updated text/
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndHasId_AndHasText_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		messageIndex = "1011";
		messageText = "This is editMessageTest11";
		updatedMessageText = "11This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Message number 1011 found/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndHasId_AndHasText_AndInDatabase_AndTextNotIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		messageIndex = "1012";
		messageText = "This is editMessageTest12";
		updatedMessageText = "This is editMessageTest12";
		argument = messageIndex + " " + updatedMessageText;

		await dbSetup(messageIndex, messageText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(messageIndex);

		//Assert
		expect(result[0]).toMatch(/Message 1012 already says:/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndHasId_AndHasText_AndInDatabase_AndTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		messageIndex = "1013";
		messageText = "This is editMessageTest13";
		updatedMessageText = "13This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		await dbSetup(messageIndex, messageText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(messageIndex);

		//Assert
		expect(result[0]).toMatch(/Message 1013 was: This is editMessageTest13/);
		expect(result[1]).toMatch(
			/Message 1013 has been updated to: 13This is editMessageTest/
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
		expect(result[0]).toMatch(/To edit a Message use !editMessage/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndNoId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "This is editMessageTest15";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To edit a Message, you must include the index/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndNoText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "1016";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/To edit a Message, you must include the updated text/
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndHasText_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1017";
		messageText = "This is editMessageTest17";
		updatedMessageText = "17This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No Message number 1017 found/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndHasText_AndInDatabase_AndTextNotIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1018";
		messageText = "This is editMessageTest18";
		updatedMessageText = "This is editMessageTest18";
		argument = messageIndex + " " + updatedMessageText;

		await dbSetup(messageIndex, messageText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(messageIndex);

		//Assert
		expect(result[0]).toMatch(/Message 1018 already says:/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_AndArgumentIsString_AndHasId_AndHasText_AndInDatabase_AndTextNotIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1019";
		messageText = "This is editMessageTest19";
		updatedMessageText = "19This is editMessageTest";
		argument = messageIndex + " " + updatedMessageText;

		await dbSetup(messageIndex, messageText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(messageIndex);

		//Assert
		expect(result[0]).toMatch(/Message 1019 was: This is editMessageTest19/);
		expect(result[1]).toMatch(
			/Message 1019 has been updated to: 19This is editMessageTest/
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
	await Message.deleteMany({ index: { $in: cleanUpMessages } });
}
