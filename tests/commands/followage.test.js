require("dotenv").config();

const db = require("../../bot-mongoose.js");

const followage = require("../../commands/followage");

let isBroadcaster;
let userInfo;
let commandLink = followage.command;
const { response } = commandLink.getCommand();

describe("followage", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndUserIsNotFollower_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 19264788, displayName: "Nightbot" };

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(result[0]).toBe(
			"@Nightbot hit that follow button, otherwise this command is doing a whole lot of nothing for you"
		);
	});

	test("IsBroadcasterFalse_AndUserIsFollower_ShouldReturnString", async () => {
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

	test("IsBroadcasterTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});
});
