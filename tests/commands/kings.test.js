require("dotenv").config();

const db = require("../../bot-mongoose.js");
const kings = require("../../commands/kings");
const LoyaltyPoint = require("../../models/loyaltypoint");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = kings.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();
let user;

describe.skip("kings", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await kings.resetKings();
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

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndUserNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 12826, displayName: "Twitch" };
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@Twitch I hate to say it/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndUserInDatabase_AndUsersBalanceNotEnough_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 6000);

		user = await LoyaltyPoint.findOne({
			userId: userInfo.userId,
		});

		user.points = 0;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		user.points = 69000;
		await user.save();

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract You lack the points to draw a card/
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndUserInDatabase_AndUsersBalanceEnough_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 6000);

		user = await LoyaltyPoint.findOne({
			userId: userInfo.userId,
		});

		user.points = 69000;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract You have drawn the/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndUserNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 12826, displayName: "Twitch" };
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@Twitch I hate to say it/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndUserInDatabase_AndUsersBalanceNotEnough_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 1000);

		user.points = 0;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		user.points = 69000;
		await user.save();

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract You lack the points to draw a card/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndUserInDatabase_AndUsersBalanceEnough_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 1000);

		user.points = 69000;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		user.points = 0;
		await user.save();

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract You have drawn the/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndUserNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 12826, displayName: "Twitch" };
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@Twitch I hate to say it/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndUserInDatabase_AndUsersBalanceNotEnough_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 1000);

		user.points = 0;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		user.points = 69000;
		await user.save();

		//Assert
		expect(result[0]).toMatch(
			/@TheStarlessAbstract You lack the points to draw a card/
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndUserInDatabase_AndUsersBalanceEnough_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 1000);

		user.points = 69000;
		await user.save();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@TheStarlessAbstract You have drawn the/);
	});
});
