require("dotenv").config();
const BaseCommand = require("../../../../classes/base-command.js");

describe("isCooldownPassed()", () => {
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When difference between lastUsed and time is less than cooldownLength", () => {
		test("Result should be false", async () => {
			//Assemble
			lastUsed = new Date() - 1000;
			cooldownLength = 20000;

			//Act
			result = await testCommand.isCooldownPassed(lastUsed, cooldownLength);

			//Assert
			expect(result).toBeFalsy();
		});
	});

	describe("When difference between lastUsed and time is greater or equal to cooldownLength", () => {
		test("Result should be false", async () => {
			//Assemble
			lastUsed = new Date() - 50000;
			cooldownLength = 20000;

			//Act
			result = await testCommand.isCooldownPassed(lastUsed, cooldownLength);

			//Assert
			expect(result).toBeTruthy();
		});
	});
});
