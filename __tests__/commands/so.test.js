require("dotenv").config();

const db = require("../../bot-mongoose.js");
const so = require("../../commands/so");

let userInfo;
let argument;
let commandLink = so.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("so", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: false };
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!so is for Mods only");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"You got to include a username to shoutout someone: !so @buhhsbot"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndNotValidUsername_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		argument = "@a";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Couldn't find a user by the name of a");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndValidUsername_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: true };
		argument = "@design_by_rose";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Go check out design_by_rose at twitch.tv/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownNotElapsed_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"You got to include a username to shoutout someone: !so @buhhsbot"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndNotValidUsername__ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		argument = "@a";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Couldn't find a user by the name of a");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndValidUsername__ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, isMod: false };
		argument = "@design_by_rose";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Go check out design_by_rose at twitch.tv/);
	});
});
