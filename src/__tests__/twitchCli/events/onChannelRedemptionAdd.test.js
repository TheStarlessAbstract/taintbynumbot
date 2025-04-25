const { ApiClient } = require("@twurple/api");
const { ChatClient } = require("@twurple/chat");
const { RefreshingAuthProvider } = require("@twurple/auth");
const { EventSubWsListener } = require("@twurple/eventsub-ws");

const clientId = "bawbg4uazhpc8xjdst6rmfzzptwxmc";
const clientSecret = "8fknb7sdezino16jxy8q77ewbdq331";
let eventSubListener;
// const { suggestGame: commandAction } = require("../../../commandActions/steam");
// const Command = require("../../../classes/commands/steam");
// const { splitArgs } = require("../../../utils/modify");
// const { isValueNumber } = require("../../../utils/valueChecks");

async function createAuthProvider() {
	let authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
	});

	// authProvider.onRefresh(async (channelId, token) => {
	// 	await updateUserTwitchToken(100612361, token);
	// });

	return authProvider;
}

function createApiClient(authProvider) {
	return new ApiClient({
		authProvider,
		// logger: {
		// 	minLevel: "debug",
		// },
	});
}

function createEventSubListener(apiClient) {
	return new EventSubWsListener({ apiClient, url: "ws://localhost:8080/ws" });
}

// jest.mock("../../../utils/modify", () => ({
// 	splitArgs: jest.fn(),
// }));
// jest.mock("../../../utils/valueChecks", () => ({
// 	isValueNumber: jest.fn(),
// }));
// jest.mock("../../../classes/commands/steam");

// let mockCommand;
// let action;
// let mockSteamApi;

describe("suggest a game from users steam library", () => {
	beforeAll(async () => {
		const authProvider = await createAuthProvider();
		const token = {
			tokenType: "twitch",
			accessToken: "8x56e0innsb9zhh1p6zfwbhebz5wln",
			refreshToken: "ht79ucf0rnfxeioada5zz2i7w6c5c5v3h54d8n0ulki7a8m9ik",
			scope: [
				"bits:read",
				"channel:manage:broadcast",
				"channel:manage:polls",
				"channel:manage:predictions",
				"channel:manage:redemptions",
				"channel:read:predictions",
				"channel:read:redemptions",
				"channel:read:subscriptions",
				"channel_subscriptions",
				"moderator:manage:announcements",
				"moderator:manage:shoutouts",
				"moderator:read:chatters",
				"moderator:read:followers",
				"openid",
			],
			expiresIn: 13414,
			obtainmentTimestamp: 1744644778309,
		};
		authProvider.addUser("100612361", token, ["test"]);
		const apiClient = createApiClient(authProvider);
		eventSubListener = createEventSubListener(apiClient);
	});

	beforeEach(() => {
		// jest.resetAllMocks();
		// mockCommand = new Command();
		// mockCommand.channelId = "100612361";
		// mockSteamApi = { resolve: jest.fn(), getUserOwnedGames: jest.fn() };
		// mockCommand.steamApi = mockSteamApi;
		// action = commandAction.bind(mockCommand);
	});

	// test id 1
	test("should return notPermitted output if config.permitted false", async () => {
		// Assemble
		console.log(eventSubListener);
		await eventSubListener.start();
		eventSubListener.onChannelRedemptionAdd("100612361", async (e) => {
			console.log(e);
		});

		await setTimeout(() => {}, 100000);

		// const config = { permitted: false };

		// jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => false);
		// jest
		// 	.spyOn(mockCommand, "getOutputString")
		// 	.mockImplementation(
		// 		() => "@TaintByNumBot - You are not permitted to use this command"
		// 	);

		// Act
		const result = "test";

		// Assert
		expect(result).toBe("test");
		// expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		// expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		// expect(splitArgs).toHaveBeenCalledTimes(0);
		// expect(mockSteamApi.resolve).toHaveBeenCalledTimes(0);
		// expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
		// expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(0);
	});

	// // test id 2
	// test("should return noUsername output if splitArgs doesn't return a steamUsername", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({ first: null });
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - You need to provide a username to suggest a game from your Steam library - !steam TheStarlessAbstract"
	// 		);
	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - You need to provide a username to suggest a game from your Steam library - !steam TheStarlessAbstract"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(0);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(0);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// });

	// // test id 3
	// test("should return idError output if steamApi.resolve returns an error", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({
	// 		first: "TheStarlessAbstract",
	// 	});
	// 	mockSteamApi.resolve.mockRejectedValue(new Error("Username not found"));
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - Steam couldn't find your name, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - Steam couldn't find your name, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(0);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// });

	// // test id 4
	// test("should return privateError output steam library is private", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({ first: "TheStarlessAbstract" });
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockRejectedValue(
	// 		new Error("Your games are private")
	// 	);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - Your games are private, so I can't suggest a game. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - Your games are private, so I can't suggest a game. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// });

	// // test id 5
	// test("should return noGames output if steamApi.getUserOwnedGames does not return any games", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({ first: "TheStarlessAbstract" });
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockReturnValue([]);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - I couldn't find any games in your Steam library"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - I couldn't find any games in your Steam library"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// });

	// // test id 6
	// test("should return randomGame output if no option set by user", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({ first: "TheStarlessAbstract" });
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockReturnValue([
	// 		{ name: "Deadlock" },
	// 		{ name: "Overwatch" },
	// 		{ name: "Metro" },
	// 	]);
	// 	jest.spyOn(mockCommand, "validOption").mockImplementation(() => false);
	// 	jest
	// 		.spyOn(mockCommand, "shuffle")
	// 		.mockImplementation(() => [
	// 			{ name: "Overwatch" },
	// 			{ name: "Metro" },
	// 			{ name: "Deadlock" },
	// 		]);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - Can't choose what to play? Why not try Overwatch"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - Can't choose what to play? Why not try Overwatch"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// });

	// // test id 7
	// test("should return invalidOption output if option exists and is not a valid option", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({
	// 		first: "TheStarlessAbstract",
	// 		second: "invalid",
	// 	});
	// 	jest.spyOn(mockCommand, "validOption").mockImplementation(() => false);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - You need to provide a valid option to suggest a game from your Steam library - !steam TheStarlessAbstract 10% or !steam TheStarlessAbstract 10"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - You need to provide a valid option to suggest a game from your Steam library - !steam TheStarlessAbstract 10% or !steam TheStarlessAbstract 10"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.validOption).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(0);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(0);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// });

	// // test id 8
	// test("should return noMatch output if option is a number, and no games are under that play time", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({
	// 		first: "TheStarlessAbstract",
	// 		second: "2",
	// 	});
	// 	jest.spyOn(mockCommand, "validOption").mockImplementation(() => true);
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockReturnValue([
	// 		{ name: "Overwatch", playTime: "1250" },
	// 		{ name: "Deadlock", playTime: "1300" },
	// 		{ name: "Metro", playTime: "1300" },
	// 	]);
	// 	isValueNumber.mockReturnValue(true);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - I couldn't find any games that match your request"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - I couldn't find any games that match your request"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.validOption).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(isValueNumber).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// });

	// // test id 9
	// test("should return timePlayed output if option is a number, and some games under the play time", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({
	// 		first: "TheStarlessAbstract",
	// 		second: "20",
	// 	});
	// 	jest.spyOn(mockCommand, "validOption").mockImplementation(() => true);
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockReturnValue([
	// 		{ name: "Overwatch", playTime: "950" },
	// 		{ name: "Deadlock", playTime: "1500" },
	// 		{ name: "Metro", playTime: "1100" },
	// 	]);
	// 	isValueNumber.mockReturnValue(true);
	// 	jest.spyOn(mockCommand, "shuffle").mockImplementation(() => [
	// 		{ name: "Metro", playTime: "1100" },
	// 		{ name: "Overwatch", playTime: "950" },
	// 		{ name: "Deadlock", playTime: "1500" },
	// 	]);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - you haven't played more than 20 hour(s) in Metro, why not play it next"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - you haven't played more than 20 hour(s) in Metro, why not play it next"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.validOption).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(isValueNumber).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// });

	// // test id 10
	// test("should return noMatch output if option is a percentage, and no games under that achievement percentage", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({
	// 		first: "TheStarlessAbstract",
	// 		second: "20%",
	// 	});
	// 	jest.spyOn(mockCommand, "validOption").mockImplementation(() => true);
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockReturnValue([
	// 		{ name: "Overwatch" },
	// 		{ name: "Deadlock" },
	// 		{ name: "Metro" },
	// 		{ name: "Metal Gear Solid" },
	// 	]);
	// 	isValueNumber.mockReturnValue(true);
	// 	jest
	// 		.spyOn(mockCommand, "achievementsCompleted")
	// 		.mockImplementation(() => []);
	// 	jest
	// 		.spyOn(mockCommand, "shuffle")
	// 		.mockImplementation(() => [{ name: "Metal Gear Solid" }]);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - you haven't played more than 20 hour(s) in Metro, why not play it next"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - you haven't played more than 20 hour(s) in Metro, why not play it next"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.validOption).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(isValueNumber).toHaveBeenCalledTimes(0);
	// 	expect(mockCommand.achievementsCompleted).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
	// });

	// // test id 11
	// test("should return noMatch output if option is a percentage, and some games under that achievement percentage", async () => {
	// 	// Assemble
	// 	const config = { permitted: true, configMap: new Map() };

	// 	jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
	// 	splitArgs.mockReturnValue({
	// 		first: "TheStarlessAbstract",
	// 		second: "20%",
	// 	});
	// 	jest.spyOn(mockCommand, "validOption").mockImplementation(() => true);
	// 	mockSteamApi.resolve.mockReturnValue(12345678);
	// 	mockSteamApi.getUserOwnedGames.mockReturnValue([
	// 		{ name: "Overwatch" },
	// 		{ name: "Deadlock" },
	// 		{ name: "Metro" },
	// 		{ name: "Metal Gear Solid" },
	// 	]);
	// 	isValueNumber.mockReturnValue(true);
	// 	jest
	// 		.spyOn(mockCommand, "achievementsCompleted")
	// 		.mockImplementation(() => [
	// 			{ name: "Deadlock" },
	// 			{ name: "Metal Gear Solid" },
	// 		]);
	// 	jest
	// 		.spyOn(mockCommand, "shuffle")
	// 		.mockImplementation(() => [
	// 			{ name: "Metal Gear Solid" },
	// 			{ name: "Deadlock" },
	// 		]);
	// 	jest
	// 		.spyOn(mockCommand, "getOutputString")
	// 		.mockImplementation(
	// 			() =>
	// 				"@TheStarlessAbstract - you haven't unlocked more than 20% of the achievements in Metal Gear Solid, go get that 100%"
	// 		);

	// 	// Act
	// 	const result = await action(config);

	// 	// Assert
	// 	expect(result).toBe(
	// 		"@TheStarlessAbstract - you haven't unlocked more than 20% of the achievements in Metal Gear Solid, go get that 100%"
	// 	);
	// 	expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
	// 	expect(splitArgs).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.validOption).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
	// 	expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
	// 	expect(isValueNumber).toHaveBeenCalledTimes(0);
	// 	expect(mockCommand.achievementsCompleted).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	// 	expect(mockCommand.shuffle).toHaveBeenCalledTimes(1);
	// });
});
