require("dotenv").config();

const db = require("../../bot-mongoose.js");

const kingsRemain = require("../../commands/kings-remain");
const kings = require("../../commands/kings");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = kingsRemain.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe.skip("kingsRemain", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await kings.resetKings();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndCooldownNotElapsed_ShouldReturnUndefined", async () => {
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

	test("IsBroadcasterFalse_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Cards remaing in this game 52");
	});

	test("IsBroadcasterTrue_AndCooldownNotElapsed_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBe("Cards remaing in this game 52");
	});

	test("IsBroadcasterTrue_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Cards remaing in this game 52");
	});
});
