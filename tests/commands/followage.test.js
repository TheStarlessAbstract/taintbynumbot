require("dotenv").config();

const followage = require("../../commands/followage");

const db = require("../../bot-mongoose.js");

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

	test("UserIsAFollower_ShouldReturnFollowLength", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(
			result[0].startsWith(
				"@design_by_rose has been following TheStarlessAbstract"
			)
		).toBe(true);
	});

	test("UserIsStreamer_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };

		//Act
		let result = await response({
			isBroadcaster,
			userInfo,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("UserIsNotFollower_ShouldReturnNotFollowerString", async () => {
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
});
