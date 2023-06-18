require("dotenv").config();

const db = require("../../bot-mongoose.js");
const points = require("../../commands/points");
const LoyaltyPoint = require("../../models/loyaltypoint");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = points.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe.skip("points", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(async () => {
		for (let i = 0; i < 2; i++) {
			if (!commandLink.getVersionActivity(i)) {
				commandLink.setVersionActive(i);
			}
		}
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndCoolDownNotElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentUndefined_AndUserNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 12826, displayName: "Twitch" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@Twitch I hate to say it,/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentUndefined_AndUserInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(1);

		let user = await LoyaltyPoint.findOne({
			userId: userInfo.userId,
		});

		user.points = 69000;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@design_by_rose has 69000 Tainty Points/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = "@design_by_rose 2000";
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@design_by_rose you aren't allowed to use this command like that/
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 12826, displayName: "Twitch" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@design_by_rose you aren't allowed to use this command like that/
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentUndefined_AndUserNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 12826, displayName: "Twitch" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@Twitch I hate to say it,/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentUndefined_AndUserInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		let user = await LoyaltyPoint.findOne({
			userId: userInfo.userId,
		});

		user.points = 69000;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@design_by_rose has 69000 Tainty Points/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@design_by_rose you aren't allowed to use this command like that/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionZeroActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndNotValidArgument_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "2000 a";
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@TheStarlessAbstract it's not that hard, just !points [username] [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndValidArgument_AndNotTwitchUser_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@a 420";
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract no user found called a/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndValidArgument_AndIsTwitchUser_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@twitch 420";
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract doesn't look like @twitch can be given points just yet/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndValidArgument_AndIsTwitchUser_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/Our glorious leader Starless, has given @design_by_rose 420 Tainty Points/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndNotValidArgument_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "2000 a";
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@TheStarlessAbstract it's not that hard, just !points [username] [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndValidArgument_AndNotTwitchUser_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@a 420";
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract no user found called a/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndValidArgument_AndTwitchUser_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@twitch 420";
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract doesn't look like @twitch can be given points just yet/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndValidArgument_AndTwitchUser_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/Our glorious leader Starless, has given @design_by_rose 420 Tainty Points/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndNoVersionsActive_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionZeroActive_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndNotValidArgument_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "2000 a";
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@TheStarlessAbstract it's not that hard, just !points [username] [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndValidArgument_AndNotTwitchUser_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@a 420";
		commandLink.setTimer(currentDateTime - 1000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract no user found called a/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndValidArgument_AndIsTwitchUser_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@twitch 420";
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract doesn't look like @twitch can be given points just yet/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndValidArgument_AndIsTwitchUser_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/Our glorious leader Starless, has given @design_by_rose 420 Tainty Points/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndNotValidArgument_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "2000 a";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@TheStarlessAbstract it's not that hard, just !points [username] [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndValidArgument_AndNotTwitchUser_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@a 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract no user found called a/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndValidArgument_AndTwitchUser_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@twitch 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract doesn't look like @twitch can be given points just yet/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndValidArgument_AndTwitchUser_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(
			/Our glorious leader Starless, has given @design_by_rose 420 Tainty Points/
		);
	});
});
