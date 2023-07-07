require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Tinder = require("../../models/tinder");

const tinder = require("../../commands/tinder");

let userInfo;
let argument;
let commandLink = tinder.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("tinder", () => {
	let cleanUpList = [];

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
		await dBCleanUp(cleanUpList);
		await db.disconnectFromMongoDB();
	});

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

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "quoteTest1304";
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1306";
		title = "This is tinderTest1306";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Tinder bio 1306/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1307";
		text = "This is tinderTest1307";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1307. /);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsNumber_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1310";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		title = "This is tinderTest1311";
		argument = title;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1312";
		text = "This is tinderTest1312";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);
		//Assert
		expect(result[0]).toMatch(/1312. This is tinderTest1312/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1314";
		argument = index;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Tinder bio 1314/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1315";
		text = "This is tinderTest1315";
		argument = index;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1315. This is tinderTest1315/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1316";
		text = "This is tinderest1316";
		argument = title;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1317";
		text = "This is tinderTest1317";
		argument = text;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1317. This is tinderTest1317/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = "tinder1320";
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1322";
		text = "This is tinderTest1322";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Tinder bio 1322/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1323";
		text = "This is tinderTest1323";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1323. /);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsString_ShouldReturnUndefined", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		text = "This is tinderTest1325";
		argument = text;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsNumber_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1326";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		text = "This is tinderTest1327";
		argument = text;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1328";
		text = "This is tinderTest1328";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);
		//Assert
		expect(result[0]).toMatch(/1328. This is tinderTest1328/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1330";
		argument = index;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Tinder bio 1330/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1331";
		text = "This is tinderTest1331";
		argument = index;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1331. This is tinderTest1331/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1332";
		text = "This is tinderTest1332";
		argument = text;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1333";
		text = "This is tinderTest1333";
		argument = text;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1333. This is tinderTest1333/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "tinder1336";
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1337";
		text = "This is tinderTest1337";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Tinder bio 1337/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1338";
		text = "This is tinderTest1338";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1338. /);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsString_ShouldReturnUndefined", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		text = "This is tinderTest1338";
		argument = text;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsNumber_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1340";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		text = "This is tinderTest1341";
		argument = text;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentIsString_AndStringIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1342";
		text = "This is tinderTest1342";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);
		//Assert
		expect(result[0]).toMatch(/1342. This is tinderTest1342/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		const tinders = await Tinder.find({ text: { $exists: true } }).lean();
		const expectedValues = tinders.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		result = result[0].substring(result[0].indexOf(" ") + 1);

		//Assert
		expect(expectedValues).toContain(result);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1344";
		argument = index;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Tinder bio 1344/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1344";
		text = "This is tinderTest1344";
		argument = index;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1344. This is tinderTest1344/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1345";
		text = "This is tinderTest1345";
		argument = text;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1346";
		text = "This is tinderTest1346";
		argument = text;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1346. This is tinderTest1346/);
	});
});

async function dbSetup(setupIndex, setupText) {
	await Tinder.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Tinder.deleteMany({ text: { $in: cleanUpQuotes } });
}
