require("dotenv").config();

const db = require("../../bot-mongoose.js");
const drinkBitch = require("../../commands/drinkbitch");
const LoyaltyPoint = require("../../models/loyaltypoint");

let isBroadcaster;
let isMod = false;
let userInfo;
let argument;
let commandLink = drinkBitch.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe.skip("drinkBitch", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await drinkBitch.updateAudioLinks();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = {};
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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndNoUserInfo_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = {};
		commandLink.setTimer(currentDateTime - 6000);

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndHasUserInfo_AndUserNotInDatabase_ShouldReturnPositiveString", async () => {
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
		expect(result[0]).toBe(
			"@Twitch It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkbitch"
		);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndHasUserInfo_AndUserInDatabase_AndNotEnoughBalance_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 6000);
		let user = await LoyaltyPoint.findOne({
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
		expect(result[0]).toMatch(/You lack the points to make Starless drink/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndHasUserInfo_AndUserInDatabase_AndHasEnoughBalance_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 6000);
		let user = await LoyaltyPoint.findOne({
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
		expect(result[0]).toBe("@TheStarlessAbstract drink, bitch!");
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndNoUserId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {};
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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndHasUserId_AndUserNotInDatabase_ShouldReturnPositiveString", async () => {
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
		expect(result[0]).toBe(
			"@Twitch It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkbitch"
		);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndHasUserId_AndUserInDatabase_AndNotEnoughBalance_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 1000);
		let user = await LoyaltyPoint.findOne({
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
		expect(result[0]).toMatch(/You lack the points to make Starless drink/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndHasUserId_AndUserInDatabase_AndHasEnoughBalance_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 1000);
		let user = await LoyaltyPoint.findOne({
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
		expect(result[0]).toBe("@TheStarlessAbstract drink, bitch!");
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndNoUserId_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = {};
		commandLink.setTimer(currentDateTime - 6000);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndHasUserId_AndUserNotInDatabase_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
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
		expect(result[0]).toBe(
			"@Twitch It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkbitch"
		);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndHasUserId_AndUserInDatabase_AndNotEnoughBalance_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 6000);
		let user = await LoyaltyPoint.findOne({
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
		expect(result[0]).toMatch(/You lack the points to make Starless drink/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndHasUserId_AndUserInDatabase_AndNotEnoughBalance_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 6000);
		let user = await LoyaltyPoint.findOne({
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
		expect(result[0]).toBe("@TheStarlessAbstract drink, bitch!");
	});
});
