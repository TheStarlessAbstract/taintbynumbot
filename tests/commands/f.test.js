require("dotenv").config();

const f = require("../../commands/f");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = f.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe.skip("f", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await f.setup();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnString", async () => {
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
		expect(result[0].startsWith("Starless has now died/failed")).toBe(true);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_ShouldReturnString", async () => {
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
		expect(result[0].startsWith("Starless has now died/failed")).toBe(true);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_ShouldReturnString", async () => {
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
		expect(result[0].startsWith("Starless has now died/failed")).toBe(true);
	});
});
