const {
	getStreamTitle: commandAction,
} = require("../../../commandActions/title");
const Command = require("../../../classes/commands/title");
const { getStreamByUserId } = require("../../../services/twitch/streams");

jest.mock("../../../services/twitch/streams", () => ({
	getStreamByUserId: jest.fn(),
}));
jest.mock("../../../classes/commands/title");

let mockCommand;
let action;

describe("get stream title", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockCommand = new Command();
		mockCommand.channelId = "100612361";
		action = commandAction.bind(mockCommand);
	});

	// test id 1
	test("should return undefined if configValidation is undefined", async () => {
		// Assemble
		const config = {};

		jest.spyOn(mockCommand, "validateConfig").mockReturnValue(undefined);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(mockCommand.validateConfig).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(0);
	});

	// test id 1
	test("should return undefined if no config.configMap", async () => {
		// Assemble
		const config = { permitted: false };

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => false);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - You are not permitted to use this command"
			);
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(0);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(0);
		expect(getStreamByUserId).toHaveBeenCalledTimes(0);
	});

	// test id 2
	test("should return notPermitted output if config.permitted false", async () => {
		// Assemble
		const config = { permitted: false, configMap: new Map() };

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => false);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - You are not permitted to use this command"
			);
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - You are not permitted to use this command"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(getStreamByUserId).toHaveBeenCalledTimes(0);
	});

	// test id 3
	test("should return noStream output if no stream found", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		getStreamByUserId.mockResolvedValue(null);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TaintByNumBot - TheStarlessAbstract doesn't seem to be streaming right now"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - TheStarlessAbstract doesn't seem to be streaming right now"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});

	// test id 4
	test("should return streamIsLive output if stream found", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		getStreamByUserId.mockResolvedValue({
			title: "ChatGPT said this was a good idea",
		});
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TaintByNumBot - The current stream title is: ChatGPT said this was a good idea"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - The current stream title is: ChatGPT said this was a good idea"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});
});
