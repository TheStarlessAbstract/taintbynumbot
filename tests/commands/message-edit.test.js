require("dotenv").config();
const db = require("../../bot-mongoose.js");

const Message = require("../../models/message");
const messageEdit = require("../../commands/message-edit");

let isBroadcaster;
let isMod;
let userInfo;
let messageIndex;
let messageText;
let updatedMessageText;
let argument;
let commandLink = messageEdit.command;
const { response } = commandLink.getCommand();

describe("editMessage", () => {
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

	test("IsBroadcasterFalse_AndIsModFalse_ShouldReturnString", async () => {
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
		expect(result[0]).toMatch(/To edit a Message use !editMessage/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringNotStartsWitMessageId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "";
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

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithMessageId_AndStringNotHaveMessageText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1004";
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

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithMessageId_AndStringHasMessageText_AndMessageIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		messageIndex = "1005";
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

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithMessageId_AndStringHasMessageText_AndMessageIdInDatabase_AndMessageTextNotIsUnique_ShouldReturnString", async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringStartsWithMessageId_AndStringHasMessageText_AndMessageIdInDatabase_AndMessageTextIsUnique_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentUndefined_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNotStartsWitMessageId_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithMessageId_AndStringNotHaveMessageText_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithMessageId_AndStringHasMessageText_AndMessageIdNotInDatabase_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithMessageId_AndStringHasMessageText_AndMessageIdInDatabase_AndMessageTextNotIsUnique_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringStartsWithMessageId_AndStringHasMessageText_AndMessageIdInDatabase_AndMessageTextIsUnique_ShouldReturnString", async () => {
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
