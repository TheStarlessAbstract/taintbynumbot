const {
	getProcessedOutputString,
	processOutputString,
} = require("../../utils");

jest.mock("../../utils/processOutputString");

describe("getProcessedOutputString()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return the processed output string when all parameters are valid and the output reference is active", () => {
		// Assemble
		const channel = {
			output: new Map([
				["outputRef", { active: true, message: "Hello, World!" }],
			]),
		};
		const outputReference = "outputRef";
		const configMap = new Map([
			["option1", "value1"],
			["option2", "value2"],
		]);

		processOutputString.mockReturnValue("Processed: Hello, World!");

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBe("Processed: Hello, World!");
		expect(processOutputString).toHaveBeenCalled();
	});

	test("should return undefined when the configMap is empty", () => {
		// Assemble
		const channel = {
			output: new Map([
				["outputRef", { active: true, message: "Hello, World!" }],
			]),
		};
		const outputReference = "outputRef";
		const configMap = new Map();

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
		expect(processOutputString).not.toHaveBeenCalled();
	});

	test("should return undefined when the channel parameter is null or undefined", () => {
		// Assemble
		const channel = null;
		const outputReference = "outputRef";
		const configMap = new Map([
			["option1", "value1"],
			["option2", "value2"],
		]);

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
		expect(processOutputString).not.toHaveBeenCalled();
	});

	test("should return undefined when the outputReference parameter is null or undefined", () => {
		// Assemble
		const channel = {
			output: new Map([
				["outputRef", { active: true, message: "Hello, World!" }],
			]),
		};
		const outputReference = null;
		const configMap = new Map([
			["option1", "value1"],
			["option2", "value2"],
		]);

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
		expect(processOutputString).not.toHaveBeenCalled();
	});

	test("should return undefined when the configMap parameter is an empty Map", () => {
		// Assemble
		const channel = {
			output: new Map([
				["outputRef", { active: true, message: "Hello, World!" }],
			]),
		};
		const outputReference = "outputRef";
		const configMap = new Map();

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
		expect(processOutputString).not.toHaveBeenCalled();
	});

	test("should return undefined when the message associated with the output reference is empty", () => {
		// Assemble
		const channel = {
			output: new Map([["outputRef", { active: true, message: "" }]]),
		};
		const outputReference = "outputRef";
		const configMap = new Map([
			["option1", "value1"],
			["option2", "value2"],
		]);

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
		expect(processOutputString).not.toHaveBeenCalled();
	});

	test("should return undefined when the output reference is not found in the channel's output", () => {
		// Assemble
		const channel = {
			output: new Map([
				["outputRef", { active: true, message: "Hello, World!" }],
			]),
		};
		const outputReference = "nonExistingOutputRef";
		const configMap = new Map([
			["option1", "value1"],
			["option2", "value2"],
		]);

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
		expect(processOutputString).not.toHaveBeenCalled();
	});

	test("should return undefined when the channel object has a null output property", () => {
		// Assemble
		const channel = {
			output: null,
		};
		const outputReference = "outputRef";
		const configMap = new Map([
			["option1", "value1"],
			["option2", "value2"],
		]);

		// Act
		const result = getProcessedOutputString(
			channel,
			outputReference,
			configMap
		);

		// Assert
		expect(result).toBeUndefined();
	});
});
