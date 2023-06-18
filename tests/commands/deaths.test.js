require("dotenv").config();

const db = require("../../bot-mongoose.js");

const deaths = require("../../commands/deaths");

let isBroadcaster;
let isMod = false;
let userInfo = {};
let argument = undefined;
let commandLink = deaths.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe.skip("deaths", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 11000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Starless has died a grand total of/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Starless has died a grand total of/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 11000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Starless has died a grand total of/);
	});
});
