require("dotenv").config();

const drinkBitch = require("../../commands/drinkbitch");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = drinkBitch.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("drinkBitch", () => {
	beforeAll(async () => {
		process.env.JEST_WORKER_ID = 96;
		db.connectToMongoDB();
		await drinkBitch.updateAudioLinks();
	});

	beforeEach(() => {
		isBroadcaster = true;
		isModUp = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		argument = undefined;
		commandLink.setTimer(currentDateTime - 1000);
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnPositiveString", async () => {
		//Assemble
		isBroadcaster = false;
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("@TheStarlessAbstract drink, bitch!");
	});

	test("IsBroadcasterIsTrue_AndUserIdIsValid_And UserHasValidBalance_ShouldReturnPositiveString", async () => {
		//Assemble

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("@TheStarlessAbstract drink, bitch!");
	});
});
