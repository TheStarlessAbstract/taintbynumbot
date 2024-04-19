require("dotenv").config();
const lurk = require("../../commands/lurk.js");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../../utils");

const command = lurk.getCommand();

jest.mock("../../utils", () => ({
	getChatCommandConfigMap: jest.fn(),
	getProcessedOutputString: jest.fn(),
}));

describe("lurk command", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return a processed output string when provided with valid configuration", async () => {
		// Assemble
		const config = {
			isBroadcaster: false,
			displayName: "design_by_rose",
			channelId: "1",
		};

		jest.spyOn(lurk, "checkCommandCanRun").mockReturnValue({
			output: new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
			version: "noArgument",
		});

		getChatCommandConfigMap.mockReturnValue(
			new Map([
				["displayName", "design_by_rose"],
				["channelId", "1"],
				["isBroadcaster", false],
			])
		);

		getProcessedOutputString.mockReturnValue(
			"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		);

		// Act
		const result = await command(config);

		// Assert
		expect(result).toBe(
			"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		);
	});

	test("should return undefined when checkCommandCanRun returns falsy", async () => {
		// Assemble
		const config = {
			isBroadcaster: false,
			displayName: "design_by_rose",
			channelId: "1",
		};

		jest.spyOn(lurk, "checkCommandCanRun").mockReturnValue(null);

		// Act
		const result = await command(config);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when getChatCommandConfigMap returns falsy", async () => {
		const config = {
			isBroadcaster: false,
			displayName: "design_by_rose",
			channelId: "1",
		};

		jest.spyOn(lurk, "checkCommandCanRun").mockReturnValue({
			output: new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
			version: "noArgument",
		});
		getChatCommandConfigMap.mockReturnValue(null);

		const result = await command(config);

		expect(result).toBeUndefined();
		expect(getChatCommandConfigMap).toHaveBeenCalledWith(config);
		expect(getChatCommandConfigMap).toHaveBeenCalledTimes(1);
	});

	test('should return undefined when commandDetails.version is not "noArgument"', async () => {
		// Assemble
		const config = {
			isBroadcaster: false,
			displayName: "design_by_rose",
			channelId: "1",
		};

		jest.spyOn(lurk, "checkCommandCanRun").mockReturnValue({
			output: new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
			version: "Argument",
		});

		// Act
		const result = await command(config);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when config is falsy", async () => {
		// Assemble
		const config = null;

		// Act
		const result = await command(config);

		// Assert
		expect(result).toBeUndefined();
	});
});
