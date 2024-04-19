const BaseCommand = require("../../../classes/base-command.js");

describe("getChannel()", () => {
	test("should return the channel object when the channelId exists", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "123";
		const channel = {
			versions: new Map([
				[
					"noArgument",
					{
						description:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
			output: new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
		};
		baseCommand.addChannel(channelId, channel);

		// Act
		const result = baseCommand.getChannel(channelId);

		// Assert
		expect(result).toEqual(channel);
	});

	test("should return null when the channelId does not exist", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "123";

		// Act
		const result = baseCommand.getChannel(channelId);

		// Assert
		expect(result).toBeNull();
	});

	test("should return null when the channelId is not a string", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = 123;

		// Act
		const result = baseCommand.getChannel(channelId);

		// Assert
		expect(result).toBeNull();
	});

	test("should return null when the channelId is an empty string", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "";

		// Act
		const result = baseCommand.getChannel(channelId);

		// Assert
		expect(result).toBeNull();
	});
});
