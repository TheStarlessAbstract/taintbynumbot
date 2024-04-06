require("dotenv").config();
const BaseCommand = require("../../../../classes/base-command.js");

describe("checkCommandStatus()", () => {
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When getCommandVersionKey() returns false", () => {
		test("Result should be false", async () => {
			//Assemble
			jest.spyOn(testCommand, "getCommandVersionKey").mockReturnValue(false);
			jest.spyOn(testCommand, "isCommandRestricted").mockReturnValue(false);

			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId: 1,
			};

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
			let result = await testCommand.checkCommandStatus(config, channel);

			//Assert
			expect(result).toBeFalsy();
		});
	});

	describe("When getCommandVersionKey() returns version key", () => {
		describe("When isCommandRestricted() returns false", () => {
			test("Result should be false", async () => {
				//Assemble
				jest
					.spyOn(testCommand, "getCommandVersionKey")
					.mockReturnValue("noArgument");
				jest.spyOn(testCommand, "isCommandRestricted").mockReturnValue(false);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId: 1,
				};

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
				let result = await testCommand.checkCommandStatus(config, channel);

				//Assert
				expect(result).toBeFalsy();
			});
		});

		describe("When isCommandRestricted() returns false", () => {
			test("Result should be ", async () => {
				//Assemble
				jest
					.spyOn(testCommand, "getCommandVersionKey")
					.mockReturnValue("noArgument");
				jest.spyOn(testCommand, "isCommandRestricted").mockReturnValue(true);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId: 1,
				};

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
				let result = await testCommand.checkCommandStatus(config, channel);

				//Assert
				expect(result).toBeTruthy();
			});
		});
	});
});
