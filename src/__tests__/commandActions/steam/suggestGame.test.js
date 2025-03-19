const { suggestGame: commandAction } = require("../../../commandActions/steam");
const Command = require("../../../classes/commands/steam");
const { splitArgs } = require("../../../utils/modify");
const { isValueNumber } = require("../../../utils/valueChecks");

jest.mock("../../../utils/modify", () => ({
	splitArgs: jest.fn(),
}));
jest.mock("../../../utils/valueChecks", () => ({
	isValueNumber: jest.fn(),
}));
jest.mock("../../../classes/commands/steam");

let mockCommand;
let action;
let mockSteamApi;

describe("suggest a game from users steam library", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockCommand = new Command();
		mockCommand.channelId = "100612361";
		mockSteamApi = { resolve: jest.fn(), getUserOwnedGames: jest.fn() };
		mockCommand.steamApi = mockSteamApi;
		action = commandAction.bind(mockCommand);
	});

	// test id 1
	test("should return notPermitted output if config.permitted false", async () => {
		// Assemble
		const config = { permitted: false };

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => false);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - You are not permitted to use this command"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - You are not permitted to use this command"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(splitArgs).toHaveBeenCalledTimes(0);
		expect(mockSteamApi.resolve).toHaveBeenCalledTimes(0);
		expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
		expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(0);
	});

	// test id 2
	test("should return idError output steam id returns an error", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		splitArgs.mockResolvedValue({ first: "TheStarlessAbstract" });
		mockSteamApi.resolve.mockRejectedValue(new Error("Username not found"));

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TheStarlessAbstract - Steam couldn't find your name, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TheStarlessAbstract - Steam couldn't find your name, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(splitArgs).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(0);
		expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});

	// test id 3
	test("should return privateError output steam library is private", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		splitArgs.mockResolvedValue({ first: "TheStarlessAbstract" });
		mockSteamApi.resolve.mockReturnValue(12345678);
		mockSteamApi.getUserOwnedGames.mockRejectedValue(
			new Error("Your games are private")
		);

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TheStarlessAbstract - Your games are private, so I can't suggest a game. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TheStarlessAbstract - Your games are private, so I can't suggest a game. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(splitArgs).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
		expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});

	// test id 4
	test("should return noGames output if steam library is empty", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		splitArgs.mockResolvedValue({ first: "TheStarlessAbstract" });
		mockSteamApi.resolve.mockReturnValue(12345678);
		mockSteamApi.getUserOwnedGames.mockReturnValue([]);

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TheStarlessAbstract - I couldn't find any games in your Steam library"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TheStarlessAbstract - I couldn't find any games in your Steam library"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(splitArgs).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
		expect(mockCommand.shuffle).toHaveBeenCalledTimes(0);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});

	// test id 5
	test("should return randomGame output if no option set by user", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		splitArgs.mockResolvedValue({ first: "TheStarlessAbstract", second: null });
		mockSteamApi.resolve.mockReturnValue(12345678);
		mockSteamApi.getUserOwnedGames.mockReturnValue([
			{ name: "Deadlock" },
			{ name: "Overwatch" },
			{ name: "Metro" },
		]);

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "shuffle")
			.mockImplementation(() => [
				{ name: "Overwatch" },
				{ name: "Metro" },
				{ name: "Deadlock" },
			]);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TheStarlessAbstract - Can't choose what to play? Why not try Overwatch"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TheStarlessAbstract - Can't choose what to play? Why not try Overwatch"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(splitArgs).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
		expect(mockCommand.shuffle).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});

	// test id 5
	test("should return randomGame output if no option set by user", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		splitArgs.mockResolvedValue({ first: "TheStarlessAbstract", second: null });
		mockSteamApi.resolve.mockReturnValue(12345678);
		mockSteamApi.getUserOwnedGames.mockReturnValue([
			{ name: "Deadlock" },
			{ name: "Overwatch" },
			{ name: "Metro" },
		]);

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "shuffle")
			.mockImplementation(() => [
				{ name: "Overwatch" },
				{ name: "Metro" },
				{ name: "Deadlock" },
			]);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TheStarlessAbstract - Can't choose what to play? Why not try Overwatch"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TheStarlessAbstract - Can't choose what to play? Why not try Overwatch"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(splitArgs).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.resolve).toHaveBeenCalledTimes(1);
		expect(mockSteamApi.getUserOwnedGames).toHaveBeenCalledTimes(1);
		expect(mockCommand.shuffle).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});
});
