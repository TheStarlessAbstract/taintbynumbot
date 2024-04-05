require("dotenv").config();
const _ = require("lodash");
const CommandNew = require("../../../../models/commandnew.js");
const BaseCommand = require("../../../../classes/base-command.js");

jest.mock("../../../../models/commandnew.js", () => ({
	findOne: jest.fn(),
}));

describe("checkChannel()", () => {
	const channelId = "1";
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When getChannel() returns undefined", () => {
		describe("And CommandNew.findOne() returns undefined", () => {
			test("Result should be undefined", async () => {
				//Assemble
				jest.spyOn(testCommand, "getChannel").mockReturnValue(undefined);
				CommandNew.findOne.mockReturnValue(undefined);
				jest.spyOn(testCommand, "addChannel").mockReturnValue(true);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId,
				};
				type = "lurk";

				//Act
				let result = await testCommand.checkChannel(config, type);

				//Assert
				expect(result).toBeUndefined();
			});
		});

		describe("And CommandNew.findOne() returns a channel object", () => {
			describe("And addChannel() returns a returns false", () => {
				test("Result should be false", async () => {
					//Assemble
					jest.spyOn(testCommand, "getChannel").mockReturnValue(undefined);
					_doc = {
						channelId: channelId,
						name: "lurk",
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
					CommandNew.findOne.mockReturnValue(_doc);
					jest.spyOn(testCommand, "addChannel").mockReturnValue(false);

					config = {
						isBroadcaster: false,
						displayName: "design_by_rose",
						channelId,
					};
					type = "lurk";

					//Act
					let result = await testCommand.checkChannel(config, type);

					//Assert
					expect(result).toBeFalsy();
				});
			});

			describe("And addChannel() returns a returns true", () => {
				test("Result should be true", async () => {
					//Assemble
					jest.spyOn(testCommand, "getChannel").mockReturnValue(undefined);
					_doc = {
						channelId: channelId,
						name: "lurk",
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
					CommandNew.findOne.mockReturnValue(_doc);
					jest.spyOn(testCommand, "addChannel").mockReturnValue(true);

					config = {
						isBroadcaster: false,
						displayName: "design_by_rose",
						channelId,
					};
					type = "lurk";

					//Act
					let result = await testCommand.checkChannel(config, type);

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
	});

	describe("When getChannel() returns a channel object", () => {
		test("Result should be channel object", async () => {
			//Assemble
			jest.spyOn(testCommand, "getChannel").mockReturnValue({
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
			});
			_doc = {
				channelId: channelId,
				name: "lurk",
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
			CommandNew.findOne.mockReturnValue(_doc);
			jest.spyOn(testCommand, "addChannel").mockReturnValue();

			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId,
			};
			type = "lurk";

			//Act
			let result = await testCommand.checkChannel(config, type);

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
