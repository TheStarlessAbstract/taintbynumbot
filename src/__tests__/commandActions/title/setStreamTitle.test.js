const {
	setStreamTitle: commandAction,
} = require("../../../commandActions/title");
const Command = require("../../../classes/commands/title");
const { getStreamByUserId } = require("../../../services/twitch/streams");
const { updateChannelInfo } = require("../../../services/twitch/channels");

jest.mock("../../../services/twitch/streams", () => ({
	getStreamByUserId: jest.fn(),
}));
jest.mock("../../../services/twitch/channels", () => ({
	updateChannelInfo: jest.fn(),
}));
jest.mock("../../../classes/commands/title");

let mockCommand;
let action;

describe("set stream title", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockCommand = new Command();
		mockCommand.channelId = "100612361";
		action = commandAction.bind(mockCommand);
	});

	// test id 1
	test("should return notPermitted output if config.permitted false", async () => {
		// Assemble
		const config = { permitted: false };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

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
		expect(getStreamByUserId).toHaveBeenCalledTimes(0);
		expect(updateChannelInfo).toHaveBeenCalledTimes(0);
	});

	// test id 2
	test("should return noStream output if no stream found", async () => {
		// Assemble
		const config = { permitted: true };

		getStreamByUserId.mockResolvedValue(null);

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
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
		expect(updateChannelInfo).toHaveBeenCalledTimes(0);
	});

	// test id 3
	test("should return existingTitle output if input already title", async () => {
		// Assemble
		const config = {
			permitted: true,
			configMap: new Map(),
			argument: "ChatGPT said this was a good idea",
		};

		getStreamByUserId.mockResolvedValue({
			title: "ChatGPT said this was a good idea",
		});

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - This is already the stream title"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe("@TaintByNumBot - This is already the stream title");
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(updateChannelInfo).toHaveBeenCalledTimes(0);
	});

	// test id 4
	test("should return updateTitle output if title updated", async () => {
		// Assemble
		const config = {
			permitted: true,
			configMap: new Map(),
			argument: "ChatGPT said this was a good idea",
		};

		getStreamByUserId.mockResolvedValue({
			title: "ChatGPT made a bunch of mistakes",
		});
		updateChannelInfo.mockResolvedValue({
			success: "ChatGPT made a bunch of mistakes",
		});

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TaintByNumBot - Title has been set to: ChatGPT made a bunch of mistakes"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - Title has been set to: ChatGPT made a bunch of mistakes"
		);
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(updateChannelInfo).toHaveBeenCalledTimes(1);
	});
});
