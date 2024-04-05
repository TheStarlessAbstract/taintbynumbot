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

	describe("When checkChannel() returns an object without verions property", () => {
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
			});
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

	describe("When checkChannel() returns an object without output property", () => {
		test("Result should be undefined", async () => {
			//Assemble
			jest.spyOn(lurk, "checkChannel").mockReturnValue({
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

	describe("When checkChannel() returns an object with versions and output property", () => {
		describe("And checkCommandStatus() returns false", () => {
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
							"noArguement",
							{
								description:
									"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
								active: true,
							},
						],
					]),
				});
				jest.spyOn(lurk, "checkCommandStatus").mockReturnValue(false);
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

		describe("And checkCommandStatus() returns true", () => {
			describe("And getChatCommandConfigMap() does not return an instance of Map", () => {
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
								"noArguement",
								{
									description:
										"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
									active: true,
								},
							],
						]),
					});

					jest.spyOn(lurk, "checkCommandStatus").mockReturnValue(true);
					getChatCommandConfigMap.mockReturnValue("Not a Map");

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

			describe("And getChatCommandConfigMap() does return an instance of Map", () => {
				describe("And getProcessedOutputString() does not return a String", () => {
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
									"noArguement",
									{
										description:
											"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
										active: true,
									},
								],
							]),
						});

						jest.spyOn(lurk, "checkCommandStatus").mockReturnValue(true);
						getChatCommandConfigMap.mockReturnValue(
							new Map([
								["displayName", "design_by_rose"],
								["channelId", channelId],
								["isBroadcaster", false],
							])
						);

						getProcessedOutputString.mockReturnValue({ some: "object" });

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

				describe("And getProcessedOutputString() does return a String", () => {
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
									"noArguement",
									{
										description:
											"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
										active: true,
									},
								],
							]),
						});

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
						expect(result).toBe(
							"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
						);
					});
				});
			});
		});
	});
});
