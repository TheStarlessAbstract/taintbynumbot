require("dotenv").config();

const db = require("../../bot-mongoose.js");
const game = require("../../commands/game");
const pubSubClient = require("../../bot-pubsubclient");

let twitchId = process.env.TWITCH_USER_ID;

let commandLink = game.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();

describe("game", () => {
	let apiClient;
	let argument;
	let currentGameId;
	let userInfo;

	beforeAll(async () => {
		db.connectToMongoDB();

		apiClient = await pubSubClient.getApiClient();
		let channel = await apiClient.channels.getChannelInfoById(twitchId);
		currentGameId = channel.gameId;

		channelId = 100612361;
		userInfo = {
			userId: 676625589,
			displayName: "design_by_rose",
		};
	});

	beforeEach(async () => {
		for (let i = 0; i < commandLink.getVersions().length; i++) {
			if (!commandLink.getVersionActivity(i)) {
				commandLink.setVersionActive(i);
			}
		}
	});

	afterAll(async () => {
		// await apiClient.channels.updateChannelInfo(twitchId, {
		// 	gameId: currentGameId,
		// });

		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		//Act
		let result = await response({
			channelId,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			channelId,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			channelId,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/TheStarlessAbstract is playing/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest04";
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest06";

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/TheStarlessAbstract is playing/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest08";

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/TheStarlessAbstract is playing/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest12";
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringNotValid_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest14";

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/no game found by that name./);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_AndStringIsValid_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "Pools, Hot Tubs, and Beaches";

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/The stream game has been updated to/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/TheStarlessAbstract is playing/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest17";

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/no game found by that name./);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 1000);
		argument = undefined;

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/TheStarlessAbstract is playing/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionZeroActive_AndArgumentIsString_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest21";
		commandLink.setVersionActive(1);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsUndefined_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndVersionOneActive_AndArgumentIsString_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest22";

		commandLink.setVersionActive(0);

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/no game found by that name/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = undefined;

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/TheStarlessAbstract is playing/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringNotValid_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "gameTest25";

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(/no game found by that name./);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndCoolDownElapsed_AndAllVersionsActive_AndArgumentIsString_AndStringIsValid_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		commandLink.setTimer(currentDateTime - 31000);
		argument = "fuck";

		//Act
		let result = await response({ channelId, userInfo, argument });

		//Assert
		expect(result[0]).toMatch(
			"The stream game has been updated to: " + argument
		);
	});
});
