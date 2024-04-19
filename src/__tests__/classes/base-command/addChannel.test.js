const BaseCommand = require("../../../../classes/base-command.js");

describe("addChannel()", () => {
	test("should add a new channel to the `channels` object when provided with a valid `channelId` and `channel` object containing `versions` and `output`", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "channel1";
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

		// Act
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(true);
		expect(baseCommand.channels[channelId]).toEqual(channel);
	});

	test("should add multiple channels to the `channels` object when provided with valid `channelId` and `channel` objects", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId1 = "channel1";
		const channel1 = {
			versions: new Map([
				[
					"version1",
					{
						description: "Version 1",
						active: true,
					},
				],
			]),
			output: new Map([
				[
					"output1",
					{
						message: "Output 1",
						active: true,
					},
				],
			]),
		};
		const channelId2 = "channel2";
		const channel2 = {
			versions: new Map([
				[
					"version2",
					{
						description: "Version 2",
						active: true,
					},
				],
			]),
			output: new Map([
				[
					"output2",
					{
						message: "Output 2",
						active: true,
					},
				],
			]),
		};

		// Act
		const result1 = baseCommand.addChannel(channelId1, channel1);
		const result2 = baseCommand.addChannel(channelId2, channel2);

		// Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(baseCommand.channels[channelId1]).toEqual(channel1);
		expect(baseCommand.channels[channelId2]).toEqual(channel2);
	});

	test("should return false and not add a channel when provided with an invalid channelId", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = 123;
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

		// Act
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(false);
		expect(baseCommand.channels[channelId]).toBeUndefined();
	});

	test("should return false and not add a channel when the channel object is missing the versions property", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "channel1";
		const channel = {
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

		// Act
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(false);
		expect(baseCommand.channels[channelId]).toBeUndefined();
	});

	test("should return false and not add a channel when provided with a channel object missing the output property", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "channel1";
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
		};

		// Act
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(false);
		expect(baseCommand.channels[channelId]).toBeUndefined();
	});

	test("should return false and not add a channel when provided with a channel object with an empty versions Map", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "channel1";
		const channel = {
			versions: new Map(),
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

		// Act
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(false);
		expect(baseCommand.channels[channelId]).toBeUndefined();
	});

	test("should return false and not add a channel when provided with a channel object with an empty output Map", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "channel1";
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
			output: new Map(),
		};

		// Act
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(false);
		expect(baseCommand.channels[channelId]).toBeUndefined();
	});

	test("should return false and not add a channel when attempting to add a channel with an existing channelId", () => {
		// Assemble
		const baseCommand = new BaseCommand();
		const channelId = "channel1";
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
		const result = baseCommand.addChannel(channelId, channel);

		// Assert
		expect(result).toBe(false);
		expect(baseCommand.channels[channelId]).toEqual(channel);
	});
});
