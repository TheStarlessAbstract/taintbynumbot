require("dotenv").config();
const BaseCommand = require("../../../../classes/base-command.js");

describe("isCommandAvailable()", () => {
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When userAllowed is false", () => {
		test("Result should be false", async () => {
			//Assemble
			jest.spyOn(testCommand, "hasPermittedRoles").mockReturnValue(false);
			jest.spyOn(testCommand, "isCooldownPassed").mockReturnValue(true);

			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId: 1,
			};

			version = {
				usableBy: ["artists", "founders", "mods", "subs", "vips", "users"],
				cooldown: { lastUsed: 1, bypassRoles: ["broadcaster"], length: 1 },
			};

			//Act
			let result = await testCommand.isCommandAvailable(config, version);

			//Assert
			expect(result).toBeFalsy();
		});
	});

	describe("When userAllowed is true", () => {
		describe("And version doesn't have a cooldown", () => {
			test("Result should be true", async () => {
				//Assemble
				jest
					.spyOn(testCommand, "hasPermittedRoles")
					.mockReturnValue(false)
					.mockReturnValueOnce(true);
				jest.spyOn(testCommand, "isCooldownPassed").mockReturnValue(true);

				config = {
					isBroadcaster: false,
					displayName: "design_by_rose",
					channelId: 1,
				};

				version = {
					usableBy: ["artists", "founders", "mods", "subs", "vips", "users"],
				};

				//Act
				let result = await testCommand.isCommandAvailable(config, version);

				//Assert
				expect(result).toBeTruthy();
			});
		});

		describe("And version has a cooldown", () => {
			describe("And bypass is true", () => {
				test("Result should be true", async () => {
					//Assemble
					jest
						.spyOn(testCommand, "hasPermittedRoles")
						.mockReturnValue(true)
						.mockReturnValueOnce(true);
					jest.spyOn(testCommand, "isCooldownPassed").mockReturnValue(true);

					config = {
						isBroadcaster: false,
						displayName: "design_by_rose",
						channelId: 1,
					};

					version = {
						usableBy: ["artists", "founders", "mods", "subs", "vips", "users"],
						cooldown: { lastUsed: 1, bypassRoles: ["broadcaster"], length: 1 },
					};

					//Act
					let result = await testCommand.isCommandAvailable(config, version);

					//Assert
					expect(result).toBeTruthy();
				});
			});

			describe("And bypass is false", () => {
				describe("And isCoolDownPassed returns false", () => {
					test("Result should be false", async () => {
						//Assemble
						jest
							.spyOn(testCommand, "hasPermittedRoles")
							.mockReturnValue(false)
							.mockReturnValueOnce(true);
						jest.spyOn(testCommand, "isCooldownPassed").mockReturnValue(false);

						config = {
							isBroadcaster: false,
							displayName: "design_by_rose",
							channelId: 1,
						};

						version = {
							usableBy: [
								"artists",
								"founders",
								"mods",
								"subs",
								"vips",
								"users",
							],
							cooldown: {
								lastUsed: 1,
								bypassRoles: ["broadcaster"],
								length: 1,
							},
						};

						//Act
						let result = await testCommand.isCommandAvailable(config, version);

						//Assert
						expect(result).toBeFalsy();
					});
				});

				describe("And isCoolDownPassed returns true", () => {
					test("Result should be true", async () => {
						//Assemble
						jest
							.spyOn(testCommand, "hasPermittedRoles")
							.mockReturnValue(false)
							.mockReturnValueOnce(true);
						jest.spyOn(testCommand, "isCooldownPassed").mockReturnValue(true);

						config = {
							isBroadcaster: false,
							displayName: "design_by_rose",
							channelId: 1,
						};

						version = {
							usableBy: [
								"artists",
								"founders",
								"mods",
								"subs",
								"vips",
								"users",
							],
							cooldown: {
								lastUsed: 1,
								bypassRoles: ["broadcaster"],
								length: 1,
							},
						};

						//Act
						let result = await testCommand.isCommandAvailable(config, version);

						//Assert
						expect(result).toBeTruthy();
					});
				});
			});
		});
	});
});
