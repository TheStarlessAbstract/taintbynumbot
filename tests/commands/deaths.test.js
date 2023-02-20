require("dotenv").config();

const deaths = require("../../commands/deaths");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = deaths.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("deaths", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(() => {
		isBroadcaster = true;
		isModUp = true;
		userInfo = {};
		argument = undefined;

		commandLink.setTimer(currentDateTime - 1000);
	});

	afterAll(() => {
		db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 11000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("Starless has died a grand total of")).toBe(
			true
		);
	});

	test("IsBroadcasterIsTrue_ShouldReturnPositiveString", async () => {
		//Assemble

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("Starless has died a grand total of")).toBe(
			true
		);
	});
});
