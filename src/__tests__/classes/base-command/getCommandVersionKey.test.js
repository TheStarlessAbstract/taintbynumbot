require("dotenv").config();
const BaseCommand = require("../../../../classes/base-command.js");
const { isValueNumber } = require("../../../utils");

jest.mock("../../../utils", () => ({
	isValueNumber: jest.fn(),
}));

describe("getCommandVersionKey()", () => {
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When there is no argument", () => {
		describe("And noArgument version is not active", () => {
			test("Result should be false", async () => {
				//Assemble
				isValueNumber.mockReturnValue(false);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId: 1,
					argument: "",
				};

				channel = {
					versions: new Map([
						[
							"noArgument",
							{
								active: false,
								isArgumentOptional: false,
								hasArgument: false,
								isArgumentNumber: false,
							},
						],
						[
							"argumentNumber",
							{
								active: true,
								isArgumentOptional: false,
								hasArgument: true,
								isArgumentNumber: true,
							},
						],
						[
							"argumentString",
							{
								active: true,
								isArgumentOptional: false,
								hasArgument: true,
								isArgumentNumber: false,
							},
						],
					]),
				};

				//Act
				let result = await testCommand.getCommandVersionKey(config, channel);

				//Assert
				expect(result).toBeFalsy();
			});
		});

		describe("And noArgument version is active", () => {
			describe("And isArgumentOptional is false", () => {
				test("Result should be version key", async () => {
					//Assemble
					isValueNumber.mockReturnValue(false);

					config = {
						isBroadcaster: false,
						displayName: "design_by_rose",
						channelId: 1,
						argument: "",
					};

					channel = {
						versions: new Map([
							[
								"noArgument",
								{
									active: true,
									isArgumentOptional: false,
									hasArgument: false,
									isArgumentNumber: false,
								},
							],
						]),
					};

					//Act
					let result = await testCommand.getCommandVersionKey(config, channel);

					//Assert
					expect(result).toBe("noArgument");
				});
			});

			describe("And isArgumentOptional is true", () => {
				describe("And hasArgument is true", () => {
					describe("And isArgumentNumber is false", () => {
						test("Result should be version key", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "",
							};

							channel = {
								versions: new Map([
									[
										"noArgument",
										{
											active: true,
											isArgumentOptional: true,
											hasArgument: true,
											isArgumentNumber: false,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBe("noArgument");
						});
					});

					describe("And isArgumentNumber is true", () => {
						test("Result should be version key", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "",
							};

							channel = {
								versions: new Map([
									[
										"noArgument",
										{
											active: true,
											isArgumentOptional: true,
											hasArgument: true,
											isArgumentNumber: true,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBe("noArgument");
						});
					});
				});
			});
		});

		describe("And all versions active", () => {
			test("Result should be noArgument", async () => {
				//Assemble
				isValueNumber.mockReturnValue(false);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId: 1,
					argument: "",
				};

				channel = {
					versions: new Map([
						[
							"noArgument",
							{
								active: true,
								isArgumentOptional: false,
								hasArgument: false,
								isArgumentNumber: false,
							},
						],
						[
							"argumentNumber",
							{
								active: true,
								isArgumentOptional: false,
								hasArgument: true,
								isArgumentNumber: true,
							},
						],
						[
							"argumentString",
							{
								active: true,
								isArgumentOptional: false,
								hasArgument: true,
								isArgumentNumber: false,
							},
						],
					]),
				};

				//Act
				let result = await testCommand.getCommandVersionKey(config, channel);

				//Assert
				expect(result).toBe("noArgument");
			});
		});
	});

	describe("When there is an argument as string", () => {
		describe("And noArgument version active", () => {
			describe("And isArgumentOptional is false", () => {
				test("Result should be false", async () => {
					//Assemble
					isValueNumber.mockReturnValue(false);

					config = {
						isBroadcaster: false,
						displayName: "design_by_rose",
						channelId: 1,
						argument: "dazed",
					};

					channel = {
						versions: new Map([
							[
								"noArgument",
								{
									active: true,
									isArgumentOptional: false,
									hasArgument: false,
									isArgumentNumber: false,
								},
							],
						]),
					};

					//Act
					let result = await testCommand.getCommandVersionKey(config, channel);

					//Assert
					expect(result).toBeFalsy();
				});
			});
			describe("And isArgumentOptional is true", () => {
				describe("And hasArgument is true", () => {
					describe("And isNumber is false", () => {
						test("Result should be noArgument", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "dazed",
							};

							channel = {
								versions: new Map([
									[
										"noArgument",
										{
											active: true,
											isArgumentOptional: true,
											hasArgument: true,
											isArgumentNumber: false,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBe("noArgument");
						});
					});
					describe("And isNumber is true", () => {
						test("Result should be false", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "dazed",
							};

							channel = {
								versions: new Map([
									[
										"noArgument",
										{
											active: true,
											isArgumentOptional: true,
											hasArgument: true,
											isArgumentNumber: true,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBeFalsy();
						});
					});
				});
			});
		});
		describe("And argumentString version active", () => {
			describe("And isArgumentOptional is false", () => {
				describe("And hasArgument is true", () => {
					describe("And isArgumentNumber is false", () => {
						test("Result should be argumentString", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "dazed",
							};

							channel = {
								versions: new Map([
									[
										"argumentString",
										{
											active: true,
											isArgumentOptional: false,
											hasArgument: true,
											isArgumentNumber: false,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBe("argumentString");
						});
					});
				});
			});
		});

		describe("And argumentNumber version active", () => {
			describe("And isArgumentOptional is false", () => {
				describe("And hasArgument is true", () => {
					describe("And isArgumentNumber is true", () => {
						test("Result should be false", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "dazed",
							};

							channel = {
								versions: new Map([
									[
										"argumentNumber",
										{
											active: true,
											isArgumentOptional: false,
											hasArgument: true,
											isArgumentNumber: true,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBeFalsy();
						});
					});
				});
			});
		});
	});

	describe("When there is an argument as string number", () => {
		describe("And noArgument version active", () => {
			describe("And isArgumentOptional is false", () => {
				test("Result should be false", async () => {
					//Assemble
					isValueNumber.mockReturnValue(false);

					config = {
						isBroadcaster: false,
						displayName: "design_by_rose",
						channelId: 1,
						argument: "123",
					};

					channel = {
						versions: new Map([
							[
								"noArgument",
								{
									active: true,
									isArgumentOptional: false,
									hasArgument: false,
									isArgumentNumber: false,
								},
							],
						]),
					};

					//Act
					let result = await testCommand.getCommandVersionKey(config, channel);

					//Assert
					expect(result).toBeFalsy();
				});
			});
			describe("And isArgumentOptional is true", () => {
				describe("And hasArgument is true", () => {
					describe("And isNumber is false", () => {
						test("Result should be noArgument", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "123",
							};

							channel = {
								versions: new Map([
									[
										"noArgument",
										{
											active: true,
											isArgumentOptional: true,
											hasArgument: true,
											isArgumentNumber: false,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBe("noArgument");
						});
					});
					describe("And isNumber is true", () => {
						test("Result should be false", async () => {
							//Assemble
							isValueNumber.mockReturnValue(false);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "dazed",
							};

							channel = {
								versions: new Map([
									[
										"noArgument",
										{
											active: true,
											isArgumentOptional: true,
											hasArgument: true,
											isArgumentNumber: true,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBeFalsy();
						});
					});
				});
			});
		});
		describe("And argumentString version active", () => {
			describe("And isArgumentOptional is false", () => {
				describe("And hasArgument is true", () => {
					describe("And isArgumentNumber is false", () => {
						test("Result should be false", async () => {
							//Assemble
							isValueNumber.mockReturnValue(true);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "123",
							};

							channel = {
								versions: new Map([
									[
										"argumentString",
										{
											active: true,
											isArgumentOptional: false,
											hasArgument: true,
											isArgumentNumber: false,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBeFalsy();
						});
					});
				});
			});
		});

		describe("And argumentNumber version active", () => {
			describe("And isArgumentOptional is false", () => {
				describe("And hasArgument is true", () => {
					describe("And isArgumentNumber is true", () => {
						test("Result should be false", async () => {
							//Assemble
							isValueNumber.mockReturnValue(true);

							config = {
								isBroadcaster: false,
								displayName: "design_by_rose",
								channelId: 1,
								argument: "123",
							};

							channel = {
								versions: new Map([
									[
										"argumentNumber",
										{
											active: true,
											isArgumentOptional: false,
											hasArgument: true,
											isArgumentNumber: true,
										},
									],
								]),
							};

							//Act
							let result = await testCommand.getCommandVersionKey(
								config,
								channel
							);

							//Assert
							expect(result).toBe("argumentNumber");
						});
					});
				});
			});
		});
	});
});
