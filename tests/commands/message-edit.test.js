require("dotenv").config();

const db = require("../../bot-mongoose.js");

// const kings = require("../../commands/kings");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
// let commandLink = kings.command;
// const { response } = commandLink.getCommand();
// let currentDateTime = new Date();

describe.skip("editMessage", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndHasUserInfo_AndUserInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(
			result[0].startsWith("@TheStarlessAbstract You have drawn the")
		).toBe(true);
	});

	//isbroadcaster
	//ismod
	//argument
	//id
	//message
	//database
	//message unique

	//0-0
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
