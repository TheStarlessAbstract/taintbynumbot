require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Helper = require("../../classes/helper");

const Message = require("../../models/message");
const messageAdd = require("../../commands/message-add");

const helper = new Helper();

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = messageAdd.command;
const { response } = commandLink.getCommand();

describe("addMessage", () => {
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
		expect(result[0]).toMatch(/!addMessage command is for Mods only/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/To add a Message use !addMessage/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndMessageNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is addMessageTest3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This is addMessageTest3/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndMessageInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is addMessageTest4";

		await dbSetup(argument);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This Message has already been added/);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toBe("To add a Message use !addMessage [message output]");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndMessageNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "This is addMessageTest6";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This is addMessageTest6/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndMessageInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is addMessageTest7";

		await dbSetup(argument);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This Message has already been added/);
	});
});

async function dbSetup(setupMessage) {
	let message = await Message.findOne({ text: setupMessage });

	if (!message) {
		let messageList = await Message.find({});
		await Message.create({
			index: helper.getNextIndex(messageList),
			text: setupMessage,
		});
	}
}

async function dBCleanUp(cleanUpMessages) {
	await Message.deleteMany({ text: { $in: cleanUpMessages } });
}
