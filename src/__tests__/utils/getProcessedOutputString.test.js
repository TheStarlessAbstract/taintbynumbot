const { getProcessedOutputString } = require("../../utils");

describe("getProcessedOutputString()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When all arguments are undefined", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const channel = undefined;
			const outputString = undefined;
			const configMap = undefined;

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When first argument is undefined", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const channel = undefined;
			const outputString = "isLurking";
			const configMap = new Map([
				["displayName", "design_by_rose"],
				["channelId", 1],
				["isBroadcaster", false],
			]);

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When first argument is not expected type", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const channel = "any string";
			const outputString = "isLurking";
			const configMap = new Map([
				["displayName", "design_by_rose"],
				["channelId", 1],
				["isBroadcaster", false],
			]);

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When second argument is undefined", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const outputMap = new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]);
			const channel = {
				output: outputMap,
			};
			const outputString = undefined;
			const configMap = new Map([
				["displayName", "design_by_rose"],
				["channelId", 1],
				["isBroadcaster", false],
			]);

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When second argument is not expected type", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const outputMap = new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]);
			const channel = {
				output: outputMap,
			};
			const outputString = { type: "Not expected" };
			const configMap = new Map([
				["displayName", "design_by_rose"],
				["channelId", 1],
				["isBroadcaster", false],
			]);

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When third argument is undefined", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const outputMap = new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]);
			const channel = {
				output: outputMap,
			};
			const outputString = "isLurking";
			const configMap = undefined;

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When third argument is unexpected type", () => {
		test("Result should be undefined", async () => {
			//Assemble
			const outputMap = new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]);
			const channel = {
				output: outputMap,
			};
			const outputString = "isLurking";
			const configMap = "Not expected";

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When all arguments expected type type", () => {
		test("Result should be expected string", async () => {
			//Assemble
			const outputMap = new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]);
			const channel = {
				output: outputMap,
			};
			const outputString = "isLurking";
			const configMap = new Map([
				["displayName", "design_by_rose"],
				["channelId", 1],
				["isBroadcaster", false],
			]);

			//Act
			const result = getProcessedOutputString(channel, outputString, configMap);

			//Assert
			expect(result).toBe(
				"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
			);
		});
	});
});
