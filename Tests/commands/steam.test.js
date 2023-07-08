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
		expect(result[0]).toMatch(/invalid format/);
	}, 10000);

	// test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest06";

	// 	commandLink.setVersionActive(0);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toMatch(/The curent title is: /);
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest08";

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// ///////

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 1000);
	// 	argument = undefined;

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;
	// 	commandLink.setVersionActive(0);
	// 	commandLink.setVersionActive(1);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;
	// 	commandLink.setVersionActive(1);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toMatch(/The curent title is: /);
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest12";
	// 	commandLink.setVersionActive(1);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;

	// 	commandLink.setVersionActive(0);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest14";

	// 	commandLink.setVersionActive(0);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBe("Title has been set to " + argument);
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toMatch(/The curent title is: /);
	// });

	// test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = false;
	// 	userInfo.isMod = true;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest16";

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBe("Title has been set to " + argument);
	// });

	// ////////

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 1000);
	// 	argument = undefined;

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;
	// 	commandLink.setVersionActive(0);
	// 	commandLink.setVersionActive(1);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;
	// 	commandLink.setVersionActive(1);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toMatch(/The curent title is: /);
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest20";
	// 	commandLink.setVersionActive(1);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;

	// 	commandLink.setVersionActive(0);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBeUndefined();
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest22";

	// 	commandLink.setVersionActive(0);

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBe("Title has been set to " + argument);
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = undefined;

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toMatch(/The curent title is: /);
	// });

	// test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_ShouldReturnString", async () => {
	// 	//Assemble
	// 	userInfo.isBroadcaster = true;
	// 	userInfo.isMod = false;
	// 	commandLink.setTimer(currentDateTime - 31000);
	// 	argument = "titleTest24";

	// 	//Act
	// 	let result = await response({
	// 		userInfo,
	// 		argument,
	// 	});

	// 	//Assert
	// 	expect(result[0]).toBe("Title has been set to " + argument);
	// });
});
