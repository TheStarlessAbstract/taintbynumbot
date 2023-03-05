require("dotenv").config();

const db = require("../../bot-mongoose.js");

const kingsReset = require("../../commands/kings-reset");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = kingsReset.command;
const { response } = commandLink.getCommand();

describe("kingsReset", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_ShouldReturnString", async () => {
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
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});
});
