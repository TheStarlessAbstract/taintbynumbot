require("dotenv").config();

const kingsRemain = require("../../commands/kings-remain");
const kings = require("../../commands/kings");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = kingsRemain.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("kingsRemain", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(async () => {
		isBroadcaster = false;
		isModUp = true;
		userInfo = {};
		argument = undefined;

		commandLink.setTimer(currentDateTime - 1000);
		await kings.resetKings();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsFalse_AndCooldownNotElapsed_ShouldReturnUndefined", async () => {
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

	test("IsBroadcasterIsFalse_AndIsModUpIsFalse_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isModUp = false;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Cards remaing in this game 52");
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCooldownNotElapsed_ShouldReturnUndefined", async () => {
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

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
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
		expect(result[0]).toBe("Cards remaing in this game 52");
	});

	test("IsBroadcasterIsTrue_AndIsModUpIsTrue_AndCooldownNotElapsed_ShouldReturnPositiveString", async () => {
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
		expect(result[0]).toBe("Cards remaing in this game 52");
	});

	test("IsBroadcasterIsTrue_AndIsModUpIsTrue_AndCooldownElapsed_ShouldReturnPositiveString", async () => {
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
		expect(result[0]).toBe("Cards remaing in this game 52");
	});
});
