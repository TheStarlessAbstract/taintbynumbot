require("dotenv").config();

const points = require("../../commands/points");

const db = require("../../bot-mongoose.js");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = points.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("points", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
	});

	beforeEach(() => {
		argument = undefined;
		userInfo = {};
		commandLink.setTimer(currentDateTime - 1000);
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("ArgumentUndefined_AndIsBroadcasterIsFalse_AndCoolDownNotElapsed_AndUserNotInDB_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 12826, displayName: "Twitch" };

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

	test("ArgumentUndefined_AndIsBroadcasterIsFalse_AndCoolDownNotElapsed_AndUserInDB_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };

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

	test("ArgumentUndefined_AndIsBroadcasterIsFalse_AndCoolDownElapsed_AndUserNotInDB_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 12826, displayName: "Twitch" };
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("@Twitch I hate to say it")).toBe(true);
	});

	test("ArgumentUndefined_AndIsBroadcasterIsFalse_AndCoolDownElapsed_AndUserInDB_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("@design_by_rose has")).toBe(true);
	});

	// needs to remove me from database at start, then readd
	// test("ArgumentUndefined_IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndUserNotInDB_ShouldReturnString", async () => {
	// 	//Assemble
	// 	isBroadcaster = true;
	// 	userInfo = { userId: 12826, displayName: "Twitch" };

	// 	//Act
	// 	let result = await response({
	// 		isBroadcaster,
	// 		isModUp,
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0].startsWith("@TheStarlessAbstract has")).toBe(true);
	// });

	test("ArgumentUndefined_IsBroadcasterIsTrue_AndCoolDownNotElapsed_AndUserInDB_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("@TheStarlessAbstract has")).toBe(true);
	});

	// needs to remove me from database at start, then readd
	// test("ArgumentUndefined_IsBroadcasterIsTrue_AndCoolDownElapsed_AndUserNotInDB_ShouldReturnString", async () => {
	// 	//Assemble
	// 	isBroadcaster = true;
	// 	userInfo = { userId: 12826, displayName: "Twitch" };
	// 	commandLink.setTimer(currentDateTime - 6000);

	// 	//Act
	// 	let result = await response({
	// 		isBroadcaster,
	// 		isModUp,
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0].startsWith("@TheStarlessAbstract has")).toBe(true);
	// });

	test("ArgumentUndefined_IsBroadcasterIsTrue_AndCoolDownElapsed_AndUserInDB_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { userId: 100612361, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0].startsWith("@TheStarlessAbstract has")).toBe(true);
	});

	test("ArgumentValid_AndIsBroadcasterIsFalse_AndCoolDownNotElapsed_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = "@design_by_rose 420";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@design_by_rose you aren't allowed to this command like that"
		);
	});

	test("ArgumentValid_AndIsBroadcasterIsFalse_AndCoolDownElapsed_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { userId: 676625589, displayName: "design_by_rose" };
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"@design_by_rose you aren't allowed to this command like that"
		);
	});

	test("ArgumentValid_AndIsBroadcasterIsTrue_AndCoolDownnNotElapsed_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Our glorious leader Starless, has given @design_by_rose 420 Tainty Points"
		);
	});

	test("ArgumentValid_AndIsBroadcasterIsTrue_AndCoolDownnElapsed_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		argument = "@design_by_rose 420";
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Our glorious leader Starless, has given @design_by_rose 420 Tainty Points"
		);
	});

	////

	test("IsBroadcasterIsTrue_AndArgumentValidNo@_AndCoolDownNotElapsed_ShouldReturnPositveString", async () => {
		//Assemble
		isBroadcaster = true;
		argument = "design_by_rose 420";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Our glorious leader Starless, has given @design_by_rose 420 Tainty Points"
		);
	});

	test("IsBroadcasterIsTrue_AndArgumentValidNo@_AndCoolDownNotElapsed_ShouldReturnPositveString", async () => {
		//Assemble
		isBroadcaster = true;
		argument = "design_by_rose 420";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Our glorious leader Starless, has given @design_by_rose 420 Tainty Points"
		);
	});
});

// if (process.env.JEST_WORKER_ID == 69) {
// 	console.log(1);
// }
