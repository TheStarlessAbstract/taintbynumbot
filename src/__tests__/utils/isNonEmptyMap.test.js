const { isNonEmptyMap } = require("../../utils");

describe("isNonEmptyMap()", () => {
	test("should return true when given a non-empty Map instance", () => {
		// Assemble
		const value = new Map();
		value.set("key", "value");

		// Act
		const result = isNonEmptyMap(value);

		// Assert
		expect(result).toBe(true);
	});

	test("should return false when given a non-Map instance", () => {
		// Assemble
		const value = {};

		// Act
		const result = isNonEmptyMap(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when given an empty Map instance", () => {
		// Assemble
		const emptyMap = new Map();

		// Act
		const result = isNonEmptyMap(emptyMap);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when given a null value", () => {
		// Assemble
		const value = null;

		// Act
		const result = isNonEmptyMap(value);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when given an undefined value", () => {
		// Assemble
		const value = undefined;

		// Act
		const result = isNonEmptyMap(value);

		// Assert
		expect(result).toBe(false);
	});
});
