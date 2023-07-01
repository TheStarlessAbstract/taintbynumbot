require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Quote = require("../../models/quote");

const quote = require("../../commands/quote");

let userInfo = {};
let argument;
let commandLink = quote.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("quote", () => {
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
		const quotes = await Quote.find({ text: { $exists: true } }).lean();
		const expectedValues = quotes.map((obj) => obj.text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		// console.log(result);
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
		title = "This is quoteTest1306";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Quote 1306/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1307";
		text = "This is quoteTest1307";
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
		title = "This is quoteTest1311";
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
		text = "This is quoteTest1312";
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
		expect(result[0]).toMatch(/1312. This is quoteTest1312/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		const quotes = await Quote.find({ text: { $exists: true } }).lean();
		const expectedValues = quotes.map((obj) => obj.text);

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
		expect(result[0]).toMatch(/There is no Quote 1314/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1315";
		text = "This is quoteTest1315";
		argument = index;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1315. This is quoteTest1315/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1316";
		text = "This is quoteTest1316";
		argument = text;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1317";
		text = "This is quoteTest1317";
		argument = text;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1317. This is quoteTest1317/);
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
		const quotes = await Quote.find({ text: { $exists: true } }).lean();
		const expectedValues = quotes.map((obj) => obj.text);

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
		argument = "quote1320";
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
		text = "This is quoteTest1322";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Quote 1322/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1323";
		text = "This is quoteTest1323";
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
		text = "This is quoteTest1325";
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
		text = "This is quoteTest1327";
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
		text = "This is quoteTest1328";
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
		expect(result[0]).toMatch(/1328. This is quoteTest1328/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		const quotes = await Quote.find({ text: { $exists: true } }).lean();
		const expectedValues = quotes.map((obj) => obj.text);

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
		expect(result[0]).toMatch(/There is no Quote 1330/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1331";
		text = "This is quoteTest1331";
		argument = index;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1331. This is quoteTest1331/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 1000);
		index = "1332";
		text = "This is quoteTest1332";
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
		text = "This is quoteTest1333";
		argument = text;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1333. This is quoteTest1333/);
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
		const quotes = await Quote.find({ text: { $exists: true } }).lean();
		const expectedValues = quotes.map((obj) => obj.text);

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
		argument = "quote1336";
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
		text = "This is quoteTest1337";
		argument = index;

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(2);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/There is no Quote 1337/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1338";
		text = "This is quoteTest1338";
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
		text = "This is quoteTest1338";
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
		text = "This is quoteTest1341";
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
		text = "This is quoteTest1342";
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
		expect(result[0]).toMatch(/1342. This is quoteTest1342/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		const quotes = await Quote.find({ text: { $exists: true } }).lean();
		const expectedValues = quotes.map((obj) => obj.text);

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
		expect(result[0]).toMatch(/There is no Quote 1344/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsNumber_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1344";
		text = "This is quoteTest1344";
		argument = index;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1344. This is quoteTest1344/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsString_AndNotInDatabase_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		commandLink.setTimer(currentDateTime - 31000);
		index = "1345";
		text = "This is quoteTest1345";
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
		text = "This is quoteTest1346";
		argument = text;

		await dbSetup(index, text);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(text);

		//Assert
		expect(result[0]).toMatch(/1346. This is quoteTest1346/);
	});
});

async function dbSetup(setupIndex, setupText) {
	await Quote.create({ index: setupIndex, text: setupText });
}

async function dBCleanUp(cleanUpQuotes) {
	await Quote.deleteMany({ text: { $in: cleanUpQuotes } });
}
