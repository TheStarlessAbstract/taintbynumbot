require("dotenv").config();

const db = require("../../bot-mongoose.js");
const song = require("../../commands/song");

let userInfo;
let commandLink = song.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("song", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, isMod: false };

		//Act
		let result = await response({
			userInfo,
		});

		//Assert

		expect(result[0]).toBe("!so is for Mods only");
	});

	test.skip("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
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

	test.skip("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndArgumentUndefined_ShouldReturnString", async () => {
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

	test.skip("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndNotValidUsername_ShouldReturnString", async () => {
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

	test.skip("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndValidUsername_ShouldReturnString", async () => {
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

	test.skip("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownNotElapsed_ShouldReturnString", async () => {
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

	test.skip("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndArgumentUndefined_ShouldReturnString", async () => {
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

	test.skip("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndNotValidUsername__ShouldReturnString", async () => {
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

	test.skip("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndValidUsername__ShouldReturnString", async () => {
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
