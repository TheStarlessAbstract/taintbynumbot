const { isNonEmptyString } = require("../../utils");

describe("isNonEmptyString()", () => {
	test("should return true when given a non-empty string", () => {
		// Assemble
		const value = "hello";

		// Act
		const result = isNonEmptyString(value);

		// Assert
		expect(result).toBe(true);
	});

	test("should return false when given an empty string with whitespace", () => {
		// Assemble
		const value = "   ";

		// Act
		const result = isNonEmptyString(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when the value is a non-string", () => {
		// Assemble
		const value = 123;

		// Act
		const result = isNonEmptyString(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when value is null", () => {
		// Assemble
		const value = null;

		// Act
		const result = isNonEmptyString(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when value is undefined", () => {
		// Assemble
		const value = undefined;

		// Act
		const result = isNonEmptyString(value);

		// Assert
		expect(result).toBe(false);
	});
});
