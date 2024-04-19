const BaseCommand = require("../../../classes/base-command.js");
const { isValueNumber } = require("../../../utils");

jest.mock("../../../utils", () => ({
	isValueNumber: jest.fn(),
}));

describe("isCooldownPassed()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return true when the cooldown period has passed and the lastUsed timestamp is before the current time", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const lastUsed = new Date(Date.now() - 3000);
		const cooldownLength = 1000;

		isValueNumber.mockReturnValue(true);

		// Act
		const result = testCommand.isCooldownPassed(lastUsed, cooldownLength);

		// Assert
		expect(isValueNumber).toHaveBeenCalled();
		expect(result).toBe(true);
	});

	it("should return true when the cooldown period is 0", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const lastUsed = new Date();
		const cooldownLength = 0;

		isValueNumber.mockReturnValue(true);

		// Act
		const result = testCommand.isCooldownPassed(lastUsed, cooldownLength);

		// Assert
		expect(isValueNumber).toHaveBeenCalled();
		expect(result).toBe(true);
	});

	test("should return false if the lastUsed parameter is not an instance of Date", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const lastUsed = "2021-01-01";
		const cooldownLength = 1000;

		isValueNumber.mockReturnValue(true);

		// Act
		const result = testCommand.isCooldownPassed(lastUsed, cooldownLength);

		// Assert
		expect(isValueNumber).not.toHaveBeenCalled();
		expect(result).toBe(false);
	});

	test("should return false if the cooldownLength parameter is not a number", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const lastUsed = new Date();
		const cooldownLength = "1000";

		isValueNumber.mockReturnValue(false);

		// Act
		const result = testCommand.isCooldownPassed(lastUsed, cooldownLength);

		// Assert
		expect(isValueNumber).not.toHaveBeenCalledWith(1000);
		expect(result).toBe(false);
	});

	test("should return false when the cooldown period has not passed and the lastUsed timestamp is after the current time", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const lastUsed = new Date(Date.now() + 3000);
		const cooldownLength = 1000;

		isValueNumber.mockReturnValue(true);

		// Act
		const result = testCommand.isCooldownPassed(lastUsed, cooldownLength);

		// Assert
		expect(isValueNumber).toHaveBeenCalled();
		expect(result).toBe(false);
	});

	test("should return false when the cooldown period has not passed", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const lastUsed = new Date(Date.now() - 3000);
		const cooldownLength = 5000;

		isValueNumber.mockReturnValue(true);

		// Act
		const result = testCommand.isCooldownPassed(lastUsed, cooldownLength);

		// Assert
		expect(isValueNumber).toHaveBeenCalled();
		expect(result).toBe(false);
	});
});
