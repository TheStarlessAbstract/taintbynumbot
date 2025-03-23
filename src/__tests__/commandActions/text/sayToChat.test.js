const { sayToChat: commandAction } = require("../../../commandActions/text");
const Command = require("../../../classes/commands/text");

jest.mock("../../../classes/commands/text");

let mockCommand;
let action;

describe("send message to chat", () => {
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
	});

	// test id 2
	test("should return text output if config.permitted true", async () => {
		// Assemble
		const config = { permitted: true, configMap: new Map() };

		jest.spyOn(mockCommand, "isPermitted").mockImplementation(() => true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(() => "I'm streaming here");

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe("I'm streaming here");
		expect(mockCommand.isPermitted).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});
});
