require("dotenv").config();

const so = require("../../commands/so");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = so.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("so", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(() => {
		isBroadcaster = false;
		isModUp = true;
		userInfo = {};
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCoolDownNotElapsed_AndArgumentIsValid_ShouldReturnUndefined", async () => {
		//Assemble
		isModUp = true;
		argument = "@design_by_rose";
		commandLink.setTimer(currentDateTime - 1000);

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

	test("IsBroadcasterIsFalse_AndIsModUpIsFalse_AndCoolDownElapsed_AndArgumentIsValid_ShouldReturnModOnlyString", async () => {
		//Assemble
		isModUp = false;
		argument = "@design_by_rose";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0] == "!so command is for Mods only").toBe(true);
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCoolDownElapsed_AndArgumentIsEmptyString_ShouldReturnUsernameString", async () => {
		//Assemble

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(
			result[0] ==
				"You got to include a username to shoutout someone: !so buhhsbot"
		).toBe(true);
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCoolDownElapsed_AndArgumentIsEmptyString_ShouldReturnUsernameString", async () => {
		//Assemble
		argument = "";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(
			result[0] ==
				"You got to include a username to shoutout someone: !so buhhsbot"
		).toBe(true);
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCoolDownElapsed_AndArgumentIsValidWithout@_ShouldReturnModOnlyString", async () => {
		//Assemble
		argument = "design_by_rose";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("Go check out ")).toBe(true);
	});

	test("IsBroadcasterIsFalse_AndIsModUpIsTrue_AndCoolDownElapsed_AndArgumentIsValidWith@_ShouldReturnShoutout", async () => {
		//Assemble
		argument = "@design_by_rose";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("Go check out ")).toBe(true);
	});

	test("IsBroadcasterIsTrue_AndIsModUpIsTrue_AndCoolDownElapsed_AndArgumentIsValid_ShouldReturnShoutout", async () => {
		//Assemble
		isBroadcaster = true;
		argument = "@design_by_rose";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("Go check out ")).toBe(true);
	});
});
