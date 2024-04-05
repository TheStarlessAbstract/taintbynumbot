const BaseCommand = require("../../../../classes/base-command.js");

describe("addChannel()", () => {
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When channelId is not a String", () => {
		test("Result should be false", async () => {
			//Assemble
			channelId = undefined;
			channel = {
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

			//Act
			result = testCommand.addChannel(channelId, channel);

			//Assert
			expect(result).toBeFalsy();
		});
	});

	describe("When channelId is a String", () => {
		describe("And channel is undefined", () => {
			test("Result should be false", async () => {
				//Assemble
				channelId = "1";
				channel = undefined;

				//Act
				result = testCommand.addChannel(channelId, channel);

				//Assert
				expect(result).toBeFalsy();
			});
		});

		describe("And channel doesn't have versions property", () => {
			test("Result should be false", async () => {
				//Assemble
				channelId = "1";
				channel = {
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

				//Act
				result = testCommand.addChannel(channelId, channel);

				//Assert
				expect(result).toBeFalsy();
			});
		});

		describe("And channel doesn't have output property", () => {
			test("Result should be false", async () => {
				//Assemble
				channelId = "1";
				channel = {
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

				//Act
				result = testCommand.addChannel(channelId, channel);

				//Assert
				expect(result).toBeFalsy();
			});
		});

		describe("And channel has versions and output properties", () => {
			describe("And channelId already exists in channels", () => {
				test("Result should be false", async () => {
					//Assemble
					channelId = "1";
					channel = {
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
					testCommand.addChannel(channelId, channel);

					//Act
					result = testCommand.addChannel(channelId, channel);

					//Assert
					expect(result).toBeFalsy();
				});
			});

			describe("And channelId doesn't exist in channels", () => {
				test("Result should be true", async () => {
					//Assemble
					channelId = "1";
					channel = {
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

					//Act
					result = testCommand.addChannel(channelId, channel);

					//Assert
					expect(result).toBeTruthy();
				});
			});
		});
	});
});
