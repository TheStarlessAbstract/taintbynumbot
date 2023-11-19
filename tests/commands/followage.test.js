require("dotenv").config();

const db = require("../../bot-mongoose.js");
const twitchRepo = require("../../repos/twitch.js");

const followage = require("../../commands/followage");

let argument;
let userInfo;
let commandLink = followage.command;
const { response } = commandLink.getCommand();

describe("followage", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await twitchRepo.init();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndUserIsNotFollower_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
			userId: 19264788,
			displayName: "Nightbot",
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@Nightbot hit that follow button, otherwise this command is doing a whole lot of nothing for you"
		);
	});

	test("IsBroadcasterIsFalse_AndUserIsFollower_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
			userId: 676625589,
			displayName: "design_by_rose",
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@design_by_rose has been staring into the Abstract abyss for/
		);
	});

	test("IsBroadcasterIsTrue_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});
});
