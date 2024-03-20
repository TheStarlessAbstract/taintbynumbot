require("dotenv").config();

const db = require("../../bot-mongoose.js");

let lurk;
let userInfo;
let commandLink;

describe("lurk", () => {
	beforeAll(async () => {
		await db.connectToMongoDB();
		console.log("beforeAll: " + 1);
		lurk = require("../../commands/lurk");
		console.log("beforeAll: " + 2);
		commandLink = lurk.command;
		console.log("beforeAll: " + 3);
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, displayName: "design_by_rose" };

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toMatch(/@design_by_rose finds a comfortable spot/);
	});

	test("IsBroadcasterIsTrue_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, displayName: "TheStarlessAbstract" };
		const { response } = commandLink.getCommand();
		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	}, 30000);
});
