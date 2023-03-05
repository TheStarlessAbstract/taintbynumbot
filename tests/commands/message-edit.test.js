require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Helper = require("../../classes/helper");

const Message = require("../../models/message");
const messageEdit = require("../../commands/message-edit");

const helper = new Helper();

let isBroadcaster;
let isMod;
let userInfo;
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

	//isbroadcaster
	//ismod
	//argument
	//id
	//message
	//database
	//message unique

	//0-0
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

	//0-1-0
	//0-1-1-0
	//0-1-1-1-0
	//0-1-1-1-1-0
	//0-1-1-1-1-1-0
	//0-1-1-1-1-1-1
	//1-0-0
	//1-0-1-0
	//1-0-1-1-0
	//1-0-1-1-1-0
	//1-0-1-1-1-1-0
	//1-0-1-1-1-1-1
	//1-1-0
	//1-1-1-0
	//1-1-1-1-0
	//1-1-1-1-1-0
	//1-1-1-1-1-1-0
	//1-1-1-1-1-1-1
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
