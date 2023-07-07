require("dotenv").config();

const db = require("../../bot-mongoose.js");

const title = require("../../commands/title");

let userInfo = {};
let argument;
let commandLink = title.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe.skip("title", () => {
	beforeAll(async () => {
		db.connectToMongoDB();

		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	});

	beforeEach(async () => {
		for (let i = 0; i < 3; i++) {
			if (!commandLink.getVersionActivity(i)) {
				commandLink.setVersionActive(i);
			}
		}
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	//broacaster
	//mod
	//coooldown - get title, not mod
	//version
	//argument

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "quoteTest1304";
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsNumber_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1310";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = {};
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = "tinder1320";
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsString_ShouldReturnUndefined", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		text = "This is tinderTest1325";
		argument = text;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = {};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsNumber_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1326";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = {};

		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "tinder1336";
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsString_ShouldReturnUndefined", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		text = "This is tinderTest1338";
		argument = text;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsNumber_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1340";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});
});
