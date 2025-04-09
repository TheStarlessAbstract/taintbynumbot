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

	// test id 2
	test("should return validation.output if configValidation.valid is false", async () => {
		// Assemble
		const config = {};

		jest.spyOn(mockCommand, "validateConfig").mockReturnValue({
			valid: false,
			output:
				"@TheStarlessAbstract - You are not permitted to use this command",
		});

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TheStarlessAbstract - You are not permitted to use this command"
		);
		expect(mockCommand.validateConfig).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(0);
	});

	// test id 3
	test("should return text output if configValidation.valid is true", async () => {
		// Assemble
		const config = {};

		jest.spyOn(mockCommand, "validateConfig").mockReturnValue({
			valid: true,
		});
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(() => "I'm streaming here");

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe("I'm streaming here");
		expect(mockCommand.validateConfig).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
	});
});
