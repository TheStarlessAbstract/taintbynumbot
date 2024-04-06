require("dotenv").config();
const BaseCommand = require("../../../../classes/base-command.js");
const { configRoleStrings } = require("../../../utils");

jest.mock("../../../utils", () => ({
	configRoleStrings: jest.fn(),
}));

describe("isCommandRestricted()", () => {
	let testCommand;

	beforeEach(() => {
		testCommand = new BaseCommand();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("When configRoleStrings returns an empty array", () => {
		test("Result should be false", async () => {
			//Assemble
			configRoleStrings.mockReturnValue([]);

			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId: 1,
			};
			permittedRoles = ["artists", "founders", "mods", "subs", "vips", "users"];

			//Act
			let result = await testCommand.hasPermittedRoles(config, permittedRoles);

			//Assert
			expect(result).toBeFalsy();
		});
	});

	describe("When configRoleStrings returns an array roles", () => {
		test("Result should be false", async () => {
			//Assemble
			configRoleStrings.mockReturnValue([
				"artists",
				"founders",
				"mods",
				"subs",
				"vips",
				"users",
			]);

			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId: 1,
			};
			permittedRoles = ["artists", "founders", "mods", "subs", "vips", "users"];

			//Act
			let result = await testCommand.hasPermittedRoles(config, permittedRoles);

			//Assert
			expect(result).toBeTruthy();
		});
	});
});
