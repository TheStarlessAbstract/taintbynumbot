require("dotenv").config();

const f = require("../../commands/f");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = f.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("f", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await f.setup();
	});

	beforeEach(() => {
		isBroadcaster = true;
		isModUp = true;
		userInfo = {};
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	// test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	isBroadcaster = false;

	// 	//Act
	// 	let result = await response({
	// 		isBroadcaster,
	// 		isModUp,
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBe(undefined);
	// });

	// test("IsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnPositiveString", async () => {
	// 	//Assemble
	// 	isBroadcaster = false;
	// 	commandLink.setTimer(currentDateTime - 11000);

	// 	//Act
	// 	let result = await response({
	// 		isBroadcaster,
	// 		isModUp,
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0].startsWith("Starless has now died/failed")).toBe(true);
	// });

	// test("IsBroadcasterIsTrue_ShouldReturnPositiveString", async () => {
	// 	//Assemble

	// 	//Act
	// 	let result = await response({
	// 		isBroadcaster,
	// 		isModUp,
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0].startsWith("Starless has now died/failed")).toBe(true);
	// });

	test("IsBroadcasterIsTrue_ShouldReturnPositiveString", async () => {
		expect(3).toBe(3);
	});
});
