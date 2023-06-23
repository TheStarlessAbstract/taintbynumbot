require("dotenv").config();

const f = require("../../commands/f");

const db = require("../../bot-mongoose.js");

const DeathCounter = require("../../models/deathcounter");

let userInfo;
let testOptions;
let commandLink = f.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();
let outputPatterns = [
	"Starless has now died/failed",
	"ThisIsFine ThisIsFine ThisIsFine",
];

describe("f", () => {
	let startDate = new Date(currentDateTime - 69000);
	startDate.setHours(0, 0, 0, 0);

	beforeAll(async () => {
		db.connectToMongoDB();

		testOptions = {
			gameName: "Just Chatting",
			startDate: new Date(startDate),
		};

		await dbSetup(startDate);

		await f.setup();
	});

	afterAll(async () => {
		await dBCleanUp(startDate);
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
		};

		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
			testOptions: testOptions,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
		};

		commandLink.setTimer(currentDateTime - 11000);

		//Act
		let result = await response({
			userInfo,
			testOptions: testOptions,
		});

		//Assert
		expect(containsPattern(result[0])).toBe(true);
	});

	test("IsBroadcasterIsTrue_AndCoolDownNotElapsed_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
		};

		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
			testOptions: testOptions,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndCoolDownElapsed_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
		};

		commandLink.setTimer(currentDateTime - 11000);

		//Act
		let result = await response({
			userInfo,
			testOptions: testOptions,
		});

		//Assert
		expect(containsPattern(result[0])).toBe(true);
	});
});

async function dbSetup(startDate) {
	await DeathCounter.create({
		deaths: 0,
		gameTitle: "Just Chatting",
		streamStartDate: startDate,
	});
}

async function dBCleanUp(startDate) {
	await DeathCounter.deleteOne({
		gameTitle: "Just Chatting",
		streamStartDate: startDate,
	});
}

function containsPattern(output) {
	return outputPatterns.some((pattern) => output.includes(pattern));
}
