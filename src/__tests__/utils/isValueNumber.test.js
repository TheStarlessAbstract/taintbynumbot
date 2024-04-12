const { isValueNumber } = require("../../utils");

describe("isValueNumber()", () => {
	test("should return true when given a valid number", () => {
		// Assemble
		const value = 42;

		// Act
		const result = isValueNumber(value);

		// Assert
		expect(result).toBe(true);
	});

	test("should return false when given a string that cannot be parsed as a number", () => {
		// Assemble
		const value = "abc";

		// Act
		const result = isValueNumber(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when given NaN", () => {
		// Assemble
		const value = NaN;

		// Act
		const result = isValueNumber(value);

		// Assert
		expect(result).toBe(false);
	});

	// Returns false when given null or undefined.
	test("should return false when given undefined", () => {
		// Assemble
		const value = undefined;

		// Act
		const result = isValueNumber(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return true when given a number as a string", () => {
		// Assemble
		const value = "42";

		// Act
		const result = isValueNumber(value);

		// Assert
		expect(result).toBe(true);
	}); //
});
