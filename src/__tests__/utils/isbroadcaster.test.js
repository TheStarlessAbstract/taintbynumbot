const { isBroadcaster } = require("../../utils");

describe("isBroadcaster()", () => {
	test("should return true when `isBroadcaster` property is true", () => {
		// Assemble
		const config = { isBroadcaster: true };

		// Act
		const result = isBroadcaster(config);

		// Assert
		expect(result).toBe(true);
	});

	test("should return false when `isBroadcaster` property is false", () => {
		// Assemble
		const config = { isBroadcaster: false };

		// Act
		const result = isBroadcaster(config);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when `isBroadcaster` property is not present", () => {
		// Assemble
		const config = {};

		// Act
		const result = isBroadcaster(config);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when `isBroadcaster` property is a non-boolean value", () => {
		// Assemble
		const config = { isBroadcaster: "true" };

		// Act
		const result = isBroadcaster(config);

		// Assert
		expect(result).toBe(false);
	});

	test("should return false when `isBroadcaster` property is null or undefined", () => {
		// Assemble
		const config = { isBroadcaster: null };

		// Act
		const result = isBroadcaster(config);

		// Assert
		expect(result).toBe(false);
	});
});
