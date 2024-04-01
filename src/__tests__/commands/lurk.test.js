require("dotenv").config();
const lurk = require("../../commands/lurk.js");
const CommandNew = require("../../../models/commandnew.js");
const Helper = require("../../../classes/helper.js");
const { getChatCommandConfigMap, isBroadcaster } = require("../../utils");

const command = lurk.getCommand();

jest.mock("../../utils", () => ({
	getChatCommandConfigMap: jest.fn(),
	isBroadcaster: jest.fn(),
}));

jest.mock("../../../models/commandnew.js", () => ({
	findOne: jest.fn(),
}));
jest.mock("../../../classes/helper.js", () => {
	const getOutput = jest.fn();
	const process = jest.fn();
	return jest.fn(() => ({
		getOutput: getOutput,
		getProcessedOutputString: process,
	}));
});
const helper = new Helper();

describe("lurk command", () => {
	let config;
	const channelId = "1";
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When isBroadcaster() returns true", () => {
		describe("test", () => {
			test("test", async () => {
				let config = { isBroadcaster: true, isMod: false, isSub: true };
				let configStrings = ["isUser"];
				let usableBy = ["isArtist", "isFounder", "isMod", "isSub", "isVip"];

				const found = configStrings.some((r) => usableBy.includes(r));
				console.log(found);
			});
		});
		test("Result should be undefined", async () => {
			//Assemble
			isBroadcaster.mockReturnValue(true);
			getChatCommandConfigMap.mockReturnValue(
				new Map([
					["displayName", "design_by_rose"],
					["channelId", channelId],
					["isBroadcaster", false],
				])
			);
			jest.spyOn(lurk, "getChannel").mockReturnValue({
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
						"noArguement",
						{
							description:
								"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
							active: true,
						},
					],
				]),
			});

			helper.getProcessedOutputString.mockReturnValue(
				"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
			);

			config = {
				isBroadcaster: true,
				displayName: "TheStarlessAbstract",
				channelId,
			};

			//Act
			let result = await command(config);

			//Assert
			expect(result).toBeUndefined();
		});
	});

	describe("When isBroadcaster() returns false", () => {
		describe("And getChatCommandConfigMap() does not return a configMap", () => {
			test("Result should be undefined", async () => {
				//Assemble
				isBroadcaster.mockReturnValue(false);
				getChatCommandConfigMap.mockReturnValue(undefined);
				jest.spyOn(lurk, "getChannel").mockReturnValue({
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
							"noArguement",
							{
								description:
									"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
								active: true,
							},
						],
					]),
				});

				helper.getProcessedOutputString.mockReturnValue(
					"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
				);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId,
				};

				//Act
				let result = await command(config);

				//Assert
				expect(result).toBeUndefined();
			});
		});

		describe("And getChatCommandConfigMap() returns a configMap", () => {
			describe("And command.getChannel() returns a channel object", () => {
				describe("And helper.getProcessedOutputString() returns a string", () => {
					test("Result should be expected string", async () => {
						//Assemble
						isBroadcaster.mockReturnValue(false);
						getChatCommandConfigMap.mockReturnValue(
							new Map([
								["displayName", "design_by_rose"],
								["channelId", channelId],
								["isBroadcaster", false],
							])
						);
						jest.spyOn(lurk, "getChannel").mockReturnValue({
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
									"noArguement",
									{
										description:
											"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
										active: true,
									},
								],
							]),
						});

						helper.getProcessedOutputString.mockReturnValue(
							"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
						);

						config = {
							isBroadcaster: false,
							displayName: "design_by_rose",
							channelId,
						};

						//Act
						let result = await command(config);

						//Assert
						expect(result).toBe(
							"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
						);
					});
				});
				describe("And helper.getProcessedOutputString() does not return a string", () => {
					test("Result should be undefined", async () => {
						//Assemble
						isBroadcaster.mockReturnValue(false);
						getChatCommandConfigMap.mockReturnValue(
							new Map([
								["displayName", "design_by_rose"],
								["channelId", channelId],
								["isBroadcaster", false],
							])
						);
						jest.spyOn(lurk, "getChannel").mockReturnValue({
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
									"noArguement",
									{
										description:
											"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
										active: true,
									},
								],
							]),
						});

						helper.getProcessedOutputString.mockReturnValue(undefined);

						config = {
							isBroadcaster: false,
							displayName: "design_by_rose",
							channelId,
						};

						//Act
						let result = await command(config);

						//Assert
						expect(result).toBeUndefined();
					});
				});
			});
			describe("And command.getChannel() does not return a channel object", () => {
				describe("And Command.findOne() does not return a Command", () => {
					test("Result should be undefined", async () => {
						//Assemble
						isBroadcaster.mockReturnValue(false);
						getChatCommandConfigMap.mockReturnValue(
							new Map([
								["displayName", "design_by_rose"],
								["channelId", channelId],
								["isBroadcaster", false],
							])
						);
						jest.spyOn(lurk, "getChannel").mockReturnValue(undefined);
						CommandNew.findOne.mockResolvedValue(undefined);
						jest.spyOn(lurk, "addChannel").mockImplementation(() => jest.fn());
						helper.getProcessedOutputString.mockReturnValue(
							"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
						);

						config = {
							isBroadcaster: false,
							displayName: "design_by_rose",
							channelId,
						};

						//Act
						let result = await command(config);

						//Assert
						expect(result).toBeUndefined();
					});
				});

				describe("And Command.findOne() returns a Command", () => {
					describe("And helper.getProcessedOutputString() returns a string", () => {
						test("Result should be expected string", async () => {
							//Assemble
							isBroadcaster.mockReturnValue(false);
							getChatCommandConfigMap.mockReturnValue(
								new Map([
									["displayName", "design_by_rose"],
									["channelId", channelId],
									["isBroadcaster", false],
								])
							);
							jest.spyOn(lurk, "getChannel").mockReturnValue(undefined);
							const _doc = {
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
							};
							CommandNew.findOne.mockResolvedValue(_doc);
							jest
								.spyOn(lurk, "addChannel")
								.mockImplementation(() => jest.fn());
							helper.getProcessedOutputString.mockReturnValue(
								"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
							);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId,
							};

							//Act
							let result = await command(config);

							//Assert
							expect(result).toBe(
								"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
							);
						});
					});
					describe("And helper.getProcessedOutputString() does not return string", () => {
						test("Result should be undefined", async () => {
							//Assemble
							isBroadcaster.mockReturnValue(false);
							getChatCommandConfigMap.mockReturnValue(
								new Map([
									["displayName", "design_by_rose"],
									["channelId", channelId],
									["isBroadcaster", false],
								])
							);
							jest.spyOn(lurk, "getChannel").mockReturnValue(undefined);
							const _doc = {
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
							};
							CommandNew.findOne.mockResolvedValue(_doc);
							jest
								.spyOn(lurk, "addChannel")
								.mockImplementation(() => jest.fn());
							helper.getProcessedOutputString.mockReturnValue(undefined);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId,
							};

							//Act
							let result = await command(config);

							//Assert
							expect(result).toBeUndefined();
						});
					});
				});
			});
		});
	});
});
