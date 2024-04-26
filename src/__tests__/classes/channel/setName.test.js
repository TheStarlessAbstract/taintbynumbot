const Channel = require("../../../classes/channel.js");

describe("setName()", () => {
	test("should set the name property to the provided name", () => {
		// Assemble
		const channel = new Channel(1, "Channel 1");
		const newName = "New Channel Name";

		// Act
		channel.setName(newName);

		// Assert
		expect(channel.name).toBe(newName);
	});

	test("should successfully set the name property to a string of length 1", () => {
		// Assemble
		const channel = new Channel(1, "Channel 1");
		const newName = "A";

		// Act
		channel.setName(newName);

		// Assert
		expect(channel.name).toBe(newName);
	});
});
