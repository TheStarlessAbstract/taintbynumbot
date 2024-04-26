const { getRandomBetweenInclusiveMax } = require("../../utils");

describe("diceRoll()", () => {
	test("should return a number between minimum and maximum value", () => {
		// Assemble
		const min = 1;
		const max = 10;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(typeof result).toBe("number");
		expect(result).toBeGreaterThanOrEqual(min);
		expect(result).toBeLessThanOrEqual(max);
	});

	test("should return undefined if the maximum value is not a number", () => {
		// Assemble
		const min = 1;
		const max = "invalid";

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined if the minimum value is not a number", () => {
		// Assemble
		const min = "invalid";
		const max = 1;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined if the maximum value is equal to minimum", () => {
		// Assemble
		const min = 1;
		const max = 1;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined if the maximum value is less than minimum", () => {
		// Assemble
		const min = 1;
		const max = 0;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should generate a random number between 1 and 1000", () => {
		// Assemble
		const min = 1;
		const max = 1000;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(1000);
	});

	test("should generate a random number between 1 and 2", () => {
		// Assemble
		const min = 1;
		const max = 2;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(2);
	});

	test("should generate a random number between 1 and Number.MAX_VALUE", () => {
		// Assemble
		const min = 1;
		const max = Number.MAX_VALUE;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	test("should generate a random number between 1 and Number.MAX_SAFE_INTEGER when the maximum value is Number.MAX_SAFE_INTEGER", () => {
		// Assemble
		const min = 1;
		const max = Number.MAX_SAFE_INTEGER;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	test("should generate a random number between 1 and Number.MIN_VALUE + 1", () => {
		// Assemble
		const min = 1;
		const max = Number.MIN_VALUE + 1;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when the maximum value is equal to Number.MIN_SAFE_INTEGER", () => {
		// Assemble
		const min = 1;
		const max = Number.MIN_SAFE_INTEGER;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when the maximum value is equal to NaN", () => {
		// Assemble
		const min = 1;
		const max = NaN;

		// Act
		const result = getRandomBetweenInclusiveMax(min, max);

		// Assert
		expect(result).toBeUndefined();
	});
});
