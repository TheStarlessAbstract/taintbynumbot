const _ = require("lodash");
const BaseCommand = require("../../../../classes/base-command.js");

describe("getChannel()", () => {
	let channelId = "1";
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When channelId is not a property of Channels", () => {
		test("Result should be false", async () => {
			//Assemble

			//Act
			result = testCommand.getChannel(channelId);

			//Assert
			expect(result).toBeFalsy();
		});
	});

	describe("When channelId is a property of Channels", () => {
		test("Result should be channel object", async () => {
			//Assemble
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
			let result = testCommand.getChannel(channelId);

			//Assert
			resultCheck = {
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
			expect(_.isEqual(result, resultCheck)).toBe(true);
		});
	});
});
