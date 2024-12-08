require("dotenv").config();

const db = require("../bot-mongoose.js");
const twitchRepo = require("../repos/twitch.js");
const twitchService = require("../services/twitch.js");

describe("twitch", () => {
	beforeAll(async () => {
		await db.connectToMongoDB();
		await twitchRepo.init();
		twitchService.init();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("twitch", async () => {
		//Assemble

		//Act
		let user1 = await twitchService.getUserByName("TheStarlessAbstract");
		let user2 = await twitchService.getUserByName("design_by_rose");

		// let result = await twitchService.shoutoutUser(user1.id, user2.id);

		//Assert
		expect(result).toBe(true);
	});
});
