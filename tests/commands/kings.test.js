require("dotenv").config();

const kings = require("../../commands/kings");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = kings.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("kings", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(async () => {
		isBroadcaster = false;
		isModUp = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);
		await kings.resetKings();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnCardDrawn", async () => {
		//Assemble
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(
			result[0].startsWith("@TheStarlessAbstract You have drawn the")
		).toBe(true);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_ShouldReturnCardDrawn", async () => {
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
		expect(
			result[0].startsWith("@TheStarlessAbstract You have drawn the")
		).toBe(true);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_ShouldReturnCardDrawn", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(
			result[0].startsWith("@TheStarlessAbstract You have drawn the")
		).toBe(true);
	});
});
