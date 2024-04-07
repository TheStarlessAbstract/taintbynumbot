require("dotenv").config();
const lurk = require("../../commands/lurk.js");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../../utils");

const command = lurk.getCommand();

jest.mock("../../utils", () => ({
	getChatCommandConfigMap: jest.fn(),
	getProcessedOutputString: jest.fn(),
}));

describe("lurk command", () => {
	let config;
	const channelId = "1";
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When checkChannel() returns undefined", () => {
		test("Result should be undefined", async () => {
			//Assemble
			jest.spyOn(lurk, "checkChannel").mockReturnValue(undefined);
			jest.spyOn(lurk, "checkCommandStatus").mockReturnValue(true);
			getChatCommandConfigMap.mockReturnValue(
				new Map([
					["displayName", "design_by_rose"],
					["channelId", channelId],
					["isBroadcaster", false],
				])
			);

			getProcessedOutputString.mockReturnValue(
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

	describe("When checkChannel() returns a channel", () => {
		describe("And checkCommandStatus() returns undefined", () => {
			test("Result should be undefined", async () => {
				//Assemble
				jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
				jest.spyOn(lurk, "checkCommandStatus").mockReturnValue(undefined);
				jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
				getChatCommandConfigMap.mockReturnValue(
					new Map([
						["displayName", "design_by_rose"],
						["channelId", channelId],
						["isBroadcaster", false],
					])
				);

				getProcessedOutputString.mockReturnValue(
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

		describe("And checkCommandStatus() returns versionKey", () => {
			describe("And version has no cost", () => {
				describe("And getChatCommandConfigMap() returns undefined", () => {
					test("Result should be undefined", async () => {
						//Assemble
						jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
						jest
							.spyOn(lurk, "checkCommandStatus")
							.mockReturnValue("noArgument");
						jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
						getChatCommandConfigMap.mockReturnValue(undefined);

						getProcessedOutputString.mockReturnValue(
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

				describe("And getChatCommandConfigMap() returns chatCommandConfigMap", () => {
					describe("And getProcessedOutputString() returns undefined", () => {
						test("Result should be undefined", async () => {
							//Assemble
							jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
							jest
								.spyOn(lurk, "checkCommandStatus")
								.mockReturnValue("noArgument");
							jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
							getChatCommandConfigMap.mockReturnValue(
								new Map([
									["displayName", "design_by_rose"],
									["channelId", channelId],
									["isBroadcaster", false],
								])
							);
							getProcessedOutputString.mockReturnValue(undefined);

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

					describe("And getProcessedOutputString() returns output", () => {
						test("Result should be String", async () => {
							//Assemble
							jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
							jest
								.spyOn(lurk, "checkCommandStatus")
								.mockReturnValue("noArgument");
							jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
							getChatCommandConfigMap.mockReturnValue(
								new Map([
									["displayName", "design_by_rose"],
									["channelId", channelId],
									["isBroadcaster", false],
								])
							);
							getProcessedOutputString.mockReturnValue(
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
				});
			});

			describe("And version has a cost", () => {
				describe("And cost is 0", () => {
					describe("And getChatCommandConfigMap() returns undefined", () => {
						test("Result should be undefined", async () => {
							//Assemble
							jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
											cost: 0,
										},
									],
								]),
							});
							jest
								.spyOn(lurk, "checkCommandStatus")
								.mockReturnValue("noArgument");
							jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
							getChatCommandConfigMap.mockReturnValue(undefined);
							getProcessedOutputString.mockReturnValue(
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

					describe("And getChatCommandConfigMap() returns chatCommandConfigMap", () => {
						describe("And getProcessedOutputString() returns undefined", () => {
							test("Result should be undefined", async () => {
								//Assemble
								jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
												cost: 0,
											},
										],
									]),
								});
								jest
									.spyOn(lurk, "checkCommandStatus")
									.mockReturnValue("noArgument");
								jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
								getChatCommandConfigMap.mockReturnValue(
									new Map([
										["displayName", "design_by_rose"],
										["channelId", channelId],
										["isBroadcaster", false],
									])
								);
								getProcessedOutputString.mockReturnValue(undefined);

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

						describe("And getProcessedOutputString() returns output", () => {
							test("Result should be undefined", async () => {
								//Assemble
								jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
												cost: 0,
											},
										],
									]),
								});
								jest
									.spyOn(lurk, "checkCommandStatus")
									.mockReturnValue("noArgument");
								jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
								getChatCommandConfigMap.mockReturnValue(
									new Map([
										["displayName", "design_by_rose"],
										["channelId", channelId],
										["isBroadcaster", false],
									])
								);
								getProcessedOutputString.mockReturnValue(
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
					});
				});

				describe("And cost is greater than 0", () => {
					describe("And checkUserBalance() returns false", () => {
						test("Result should be undefined", async () => {
							//Assemble
							jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
											cost: 500,
										},
									],
								]),
							});
							jest
								.spyOn(lurk, "checkCommandStatus")
								.mockReturnValue("noArgument");
							jest.spyOn(lurk, "checkUserBalance").mockReturnValue(false);
							getChatCommandConfigMap.mockReturnValue(
								new Map([
									["displayName", "design_by_rose"],
									["channelId", channelId],
									["isBroadcaster", false],
								])
							);
							getProcessedOutputString.mockReturnValue(
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
							expect(result).toBe(undefined);
						});
					});

					describe("And checkUserBalance() returns trie", () => {
						describe("And getChatCommandConfigMap() returns undefined", () => {
							test("Result should be undefined", async () => {
								//Assemble
								jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
												cost: 500,
											},
										],
									]),
								});
								jest
									.spyOn(lurk, "checkCommandStatus")
									.mockReturnValue("noArgument");
								jest.spyOn(lurk, "checkUserBalance").mockReturnValue(true);
								getChatCommandConfigMap.mockReturnValue(undefined);
								getProcessedOutputString.mockReturnValue(
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

						describe("And getChatCommandConfigMap() returns chatCommandConfigMap", () => {
							describe("And getProcessedOutputString() returns undefined", () => {
								test("Result should be undefined", async () => {
									//Assemble
									jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
													cost: 500,
												},
											],
										]),
									});
									jest
										.spyOn(lurk, "checkCommandStatus")
										.mockReturnValue("noArgument");
									jest.spyOn(lurk, "checkUserBalance").mockReturnValue(true);
									getChatCommandConfigMap.mockReturnValue(
										new Map([
											["displayName", "design_by_rose"],
											["channelId", channelId],
											["isBroadcaster", false],
										])
									);
									getProcessedOutputString.mockReturnValue(undefined);

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

							describe("And getProcessedOutputString() returns output", () => {
								test("Result should be undefined", async () => {
									//Assemble
									jest.spyOn(lurk, "checkChannel").mockReturnValue({
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
													cost: 500,
												},
											],
										]),
									});
									jest
										.spyOn(lurk, "checkCommandStatus")
										.mockReturnValue("noArgument");
									jest.spyOn(lurk, "checkUserBalance").mockReturnValue(true);
									getChatCommandConfigMap.mockReturnValue(
										new Map([
											["displayName", "design_by_rose"],
											["channelId", channelId],
											["isBroadcaster", false],
										])
									);
									getProcessedOutputString.mockReturnValue(
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
						});
					});
				});
			});
		});
	});
});
