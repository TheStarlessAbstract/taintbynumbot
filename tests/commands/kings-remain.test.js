require("dotenv").config();

const db = require("../../bot-mongoose.js");

const kingsRemain = require("../../commands/kings-remain");
const kings = require("../../commands/kings");

let userInfo;
let commandLink = kingsRemain.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("kingsRemain", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await kings.resetKings();
	}, 10000);

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	}, 10000);

	test("IsBroadcasterFalse_AndCooldownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
		};
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterFalse_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
		};
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBe("Cards remaining in this game 52");
	});

	test("IsBroadcasterTrue_AndCooldownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
		};
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
		};
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBe("Cards remaining in this game 52");
	});
});
