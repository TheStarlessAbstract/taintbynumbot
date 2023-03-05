require("dotenv").config();

const db = require("../../bot-mongoose.js");

const commandAdd = require("../../commands/message-add");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = commandAdd.command;
const { response } = commandLink.getCommand();

describe("addMessage", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	//isbroadcaster
	//ismod
	//argument

	//0-0
	test.skip("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnString", async () => {
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
		expect(result[0]).toMatch(/!addmessage command is for Mods only/);
	});

	//0-1-0
	test.skip("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toMatch(
			/To add a Message use !addMessage [message output]/
		);
	});

	//0-1-1
	test.skip("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "This is a test message1";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/To add a Message use !addMessage [message output]/
		);
	});

	//1-0-0
	test.skip("IsBroadcasterIsTrue_AndIsModIsFalse_AndNoUserInfo_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		userInfo = {};

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!addmessage command is for Mods only/);
	});

	//1-0-1
	test.skip("IsBroadcasterIsTrue_AndIsModIsFalse_AndUserInfo_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		userInfo = {};

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!addmessage command is for Mods only/);
	});

	//1-1-0
	//1-1-1
});
