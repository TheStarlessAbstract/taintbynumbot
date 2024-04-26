const Channel = require("../../../classes/channel.js");

describe("getName()", () => {
	test("should return the name of the channel when called", () => {
		// Assemble
		const channel = new Channel(1, "Test Channel");

		// Act
		const result = channel.getName();

		// Assert
		expect(result).toBe("Test Channel");
	});

	test("should return a string value", () => {
		// Assemble
		const channel = new Channel(1, "Test Channel");

		// Act
		const result = channel.getName();

		// Assert
		expect(typeof result).toBe("string");
	});

	test("should return undefined if the name property is not defined", () => {
		// Assemble
		const channel = new Channel(1);

		// Act
		const result = channel.getName();

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return null if the name property is null", () => {
		// Assemble
		const channel = new Channel(1, null);

		// Act
		const result = channel.getName();

		// Assert
		expect(result).toBeNull();
	});
});
