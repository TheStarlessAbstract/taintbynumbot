require("dotenv").config();

const db = require("../../bot-mongoose.js");

const kingsReset = require("../../commands/kings-reset");

let userInfo;
let commandLink = kingsReset.command;
const { response } = commandLink.getCommand();

describe.skip("kingsReset", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});
});
