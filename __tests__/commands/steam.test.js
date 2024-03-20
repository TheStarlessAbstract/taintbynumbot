require("dotenv").config();

const db = require("../../bot-mongoose.js");

const steam = require("../../commands/steam");

const pubSubClient = require("../../bot-pubsubclient");

let twitchId = process.env.TWITCH_USER_ID;

let commandLink = steam.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("steam", () => {
	let apiClient;
	let argument;
	let currentTitle;
	let userInfo;

	beforeAll(async () => {
		db.connectToMongoDB();

		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	});

	beforeEach(async () => {});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	//broacaster
	//coooldown
	//argument

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndUsernameIsNotFound_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "thestarlesssbstract";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Username not found/);
	}, 10000);

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndUsernameIsInvalidFormat_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "a";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/invalid format/);
	}, 10000);

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndArgumentIsString_AndUsernameIsFound_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "TheStarlessAbstract";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/You should play/);
	}, 30000);

	/////////

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndUsernameIsNotFound_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "thestarlesssbstract";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/Username not found/);
	}, 10000);

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndUsernameIsInvalidFormat_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "a";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/invalid format/);
	}, 10000);

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndArgumentIsString_AndUsernameIsFound_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "TheStarlessAbstract";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/You should play/);
	}, 30000);
});
