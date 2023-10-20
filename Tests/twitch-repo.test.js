require("dotenv").config();

const db = require("./../bot-mongoose.js");
const twitch = require("./../repos/twitch");

describe("twitch", () => {
	beforeAll(async () => {
		await db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("twitch", async () => {
		//Assemble

		//Act
		let result = await twitch.init();

		//Assert
		expect(result).toBe(true);
	});
});
