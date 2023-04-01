require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Title = require("../../models/title");
const modAbuse = require("../../commands/modabuse");

let isBroadcaster;
let isMod = false;
let userInfo;
let argument;
let commandLink = modAbuse.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("modAbuse", () => {
	let index;
	let title;

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

	test("IsBroadcasterFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
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

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
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

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const titles = await Title.find({ text: { $exists: true } }).lean();
		const expectedValues = titles.map((obj) => obj.text);

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

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "modAbuseTest1304";
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
		expect(result[0]).toBe("To get a random ModAbuse, use !modAbuse");
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
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
		expect(result[0]).toBe(
			"To get a ModAbsue by its ID use !modAbuse [number]"
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1306";
		argument = index;

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
		expect(result[0]).toMatch(/There is no ModAbuse 1306/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1307";
		title = "This is modAbuseTest1307";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1307. /);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndStringIsText_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		title = "This is modAbuseTest1308";
		argument = title;

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
		expect(result[0]).toBe(
			"To get a ModAbsue by its ID use !modAbuse [number]"
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

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
		expect(result[0]).toBe(
			"To get a random ModAbuse that includes specific text, use !modAbuse [text]"
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsNumber_ShouldReturnString", async () => {
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
		expect(result[0]).toBe(
			"To get a random ModAbuse that includes specic text, use !modAbuse [text]"
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsText_AndModAbuseTextNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		title = "This is modAbuseTest1311";
		argument = title;

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
		expect(result[0]).toBe(
			"No ModAbuse found mentioning: This is modAbuseTest1311"
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsText_AndModAbuseTextInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1312";
		title = "This is modAbuseTest1312";
		argument = title;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);
		//Assert
		expect(result[0]).toMatch(/1312. This is modAbuseTest1312/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = {};

		const titles = await Title.find({ text: { $exists: true } }).lean();
		const expectedValues = titles.map((obj) => obj.text);

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

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1314";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no ModAbuse 1314/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1315";
		title = "This is modAbuseTest1315";
		argument = index;

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1315. This is modAbuseTest1315/);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsText_AndModAbuseTextNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1316";
		title = "This is modAbuseTest1316";
		argument = title;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"No ModAbuse found mentioning: This is modAbuseTest1316"
		);
	});

	test("IsBroadcasterFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsText_AndModAbuseTextInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1317";
		title = "This is modAbuseTest1317";
		argument = title;

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1317. This is modAbuseTest1317/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;
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

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionZeroActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const titles = await Title.find({ text: { $exists: true } }).lean();
		const expectedValues = titles.map((obj) => obj.text);

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

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = "modAbuse1320";
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
		expect(result[0]).toBe("To get a random ModAbuse, use !modAbuse");
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toBe(
			"To get a ModAbsue by its ID use !modAbuse [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1322";
		argument = index;

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
		expect(result[0]).toMatch(/There is no ModAbuse 1322/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1323";
		title = "This is modAbuseTest1323";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1323. /);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentString_AndStringIsText_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		title = "This is modAbuseTest1325";
		argument = title;

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
		expect(result[0]).toBe(
			"To get a ModAbsue by its ID use !modAbuse [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

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
		expect(result[0]).toBe(
			"To get a random ModAbuse that includes specific text, use !modAbuse [text]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsNumber_ShouldReturnString", async () => {
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
		expect(result[0]).toBe(
			"To get a random ModAbuse that includes specic text, use !modAbuse [text]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsText_AndModAbuseTextNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		title = "This is modAbuseTest1327";
		argument = title;

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
		expect(result[0]).toBe(
			"No ModAbuse found mentioning: This is modAbuseTest1327"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsText_AndModAbuseTextInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1328";
		title = "This is modAbuseTest1328";
		argument = title;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);
		//Assert
		expect(result[0]).toBe("1328. This is modAbuseTest1328");
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		const titles = await Title.find({ text: { $exists: true } }).lean();
		const expectedValues = titles.map((obj) => obj.text);

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

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1330";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no ModAbuse 1330/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1331";
		title = "This is modAbuseTest1331";
		argument = index;

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1331. This is modAbuseTest1331/);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsText_AndModAbuseTextNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1332";
		title = "This is modAbuseTest1332";
		argument = title;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"No ModAbuse found mentioning: This is modAbuseTest1332"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsText_AndModAbuseTextInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1333";
		title = "This is modAbuseTest1333";
		argument = title;

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1333. This is modAbuseTest1333/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
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

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);
		commandLink.setVersionActive(2);
		const titles = await Title.find({ text: { $exists: true } }).lean();
		const expectedValues = titles.map((obj) => obj.text);

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

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "modAbuse1336";
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
		expect(result[0]).toBe("To get a random ModAbuse, use !modAbuse");
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
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
		expect(result[0]).toBe(
			"To get a ModAbsue by its ID use !modAbuse [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1337";
		argument = index;

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
		expect(result[0]).toMatch(/There is no ModAbuse 1337/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1338";
		title = "This is modAbuseTest1338";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1338. /);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentString_AndStringIsText_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		title = "This is modAbuseTest1338";
		argument = title;

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
		expect(result[0]).toBe(
			"To get a ModAbsue by its ID use !modAbuse [number]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

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
		expect(result[0]).toBe(
			"To get a random ModAbuse that includes specific text, use !modAbuse [text]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsNumber_ShouldReturnString", async () => {
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
		expect(result[0]).toBe(
			"To get a random ModAbuse that includes specic text, use !modAbuse [text]"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsText_AndModAbuseTextNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		title = "This is modAbuseTest1341";
		argument = title;

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
		expect(result[0]).toBe(
			"No ModAbuse found mentioning: This is modAbuseTest1341"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndVersionTwoActive_AndArgumentString_AndStringIsText_AndModAbuseTextInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1342";
		title = "This is modAbuseTest1342";
		argument = title;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);
		//Assert
		expect(result[0]).toMatch(/1342. This is modAbuseTest1342/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		const titles = await Title.find({ text: { $exists: true } }).lean();
		const expectedValues = titles.map((obj) => obj.text);

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

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1344";
		argument = index;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no ModAbuse 1344/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1344";
		title = "This is modAbuseTest1344";
		argument = index;

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1344. This is modAbuseTest1344/);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsText_AndModAbuseTextNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1345";
		title = "This is modAbuseTest1345";
		argument = title;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"No ModAbuse found mentioning: This is modAbuseTest1345"
		);
	});

	test("IsBroadcasterTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentString_AndStringIsText_AndModAbuseTextInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1346";
		title = "This is modAbuseTest1346";
		argument = title;

		await dbSetup(index, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(index);

		//Assert
		expect(result[0]).toMatch(/1346. This is modAbuseTest1346/);
	});
});

async function dbSetup(setupIndex, setupTitle) {
	let title = await Title.findOne({ index: setupIndex, text: setupTitle });

	if (!title) {
		await Title.create({
			index: setupIndex,
			text: setupTitle,
		});
	}
}

async function dBCleanUp(cleanUpTitles) {
	await Title.deleteMany({ index: { $in: cleanUpTitles } });
}
