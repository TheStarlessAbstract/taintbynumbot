require("dotenv").config();

const kingsReset = require("../../commands/kings-reset");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = kingsReset.command;
const { response } = commandLink.getCommand();

describe("kingsReset", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(() => {
		isBroadcaster = false;
		isModUp = true;
		userInfo = {};
		argument = undefined;
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsFalse_ShouldReturnUndefined", async () => {
		//Assemble
		isModUp = false;

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_ShouldReturnPositiveString", async () => {
		//Assemble

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModUpIsTrue_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"A new game of Kings has been dealt, with 52 cards!"
		);
	});
});
