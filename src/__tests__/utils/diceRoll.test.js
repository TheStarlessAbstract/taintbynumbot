const { diceRoll } = require("../../utils");

describe("diceRoll()", () => {
	it("should generate a random number between 1 and the given maximum value", () => {
		// Assemble
		const max = 10;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should return a number between 1 and the given maximum value", () => {
		// Assemble
		const max = 10;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(typeof result).toBe("number");
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should return undefined if the maximum value is not a number", () => {
		// Assemble
		const max = "invalid";

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should return undefined if the maximum value is less than or equal to 1", () => {
		// Assemble
		const max = 0;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should generate a random number between 1 and 1000", () => {
		// Assemble
		const max = 1000;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(1000);
	});

	it("should generate a random number between 1 and 2", () => {
		// Assemble
		const max = 2;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(2);
	});

	it("should generate a random number between 1 and the given maximum value", () => {
		// Assemble
		const max = 10;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should return undefined when the maximum value is -Infinity", () => {
		// Assemble
		const max = -Infinity;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should return a random number between 1 and Infinity", () => {
		// Assemble
		const max = Infinity;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should generate a random number between 1 and Number.MAX_VALUE", () => {
		// Assemble
		const max = Number.MAX_VALUE;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should generate a random number between 1 and Number.MAX_SAFE_INTEGER when the maximum value is Number.MAX_SAFE_INTEGER", () => {
		// Assemble

		// Act
		const res = diceRoll(Number.MAX_SAFE_INTEGER);

		// Assert
		expect(res).toBeGreaterThanOrEqual(1);
		expect(res).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
	});

	it("should generate a random number between 1 and Number.MIN_SAFE_INTEGER + 1", () => {
		// Assemble
		const max = Number.MIN_SAFE_INTEGER + 1;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should generate a random number between 1 and Number.MIN_VALUE + 1", () => {
		// Assemble
		const max = Number.MIN_VALUE + 1;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should return undefined when the maximum value is equal to Number.MIN_SAFE_INTEGER", () => {
		// Assemble
		const max = Number.MIN_SAFE_INTEGER;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should return undefined when the maximum value is equal to Number.MAX_SAFE_INTEGER + 1", () => {
		// Assemble
		const max = Number.MAX_SAFE_INTEGER + 1;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should return undefined when the maximum value is equal to NaN", () => {
		// Assemble
		const max = NaN;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should return undefined when the maximum value is equal to Number.POSITIVE_INFINITY", () => {
		// Assemble
		const max = Number.POSITIVE_INFINITY;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});

	it("should return undefined when the maximum value is equal to Number.NEGATIVE_INFINITY", () => {
		// Assemble
		const max = Number.NEGATIVE_INFINITY;

		// Act
		const result = diceRoll(max);

		// Assert
		expect(result).toBeUndefined();
	});
});
