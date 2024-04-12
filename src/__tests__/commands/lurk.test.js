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

	test("Result should be undefined", async () => {
		//Assemble
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

		const config = {
			isBroadcaster: false,
			displayName: "design_by_rose",
			channelId: "1",
		};

		//Act
		let result = await command(config);

		//Assert
		expect(result).toBe(
			"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		);
	});
});
