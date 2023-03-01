require("dotenv").config();

const db = require("../../bot-mongoose.js");

const followage = require("../../commands/followage");

let isBroadcaster;
let userInfo;
let commandLink = followage.command;
const { response } = commandLink.getCommand();

describe.skip("followage", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsNotBroadcaster_AndNoUserInfo_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = {};

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsNotBroadcaster_AndHasUserInfo_AndUserIsNotFollower_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 19264788, displayName: "Nightbot" };

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(
			result[0] ==
				"@Nightbot hit that follow button, otherwise this command is doing a whole lot of nothing for you"
		).toBe(true);
	});

	test("IsNotBroadcaster_AndHasUserInfo_AndUserIsFollower_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(result[0]).toMatch(
			/@design_by_rose has been following TheStarlessAbstract for/
		);
	});

	test("IsBroadcaster_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {};

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});
});
