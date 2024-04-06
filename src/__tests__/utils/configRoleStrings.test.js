require("dotenv").config();
const { configRoleStrings } = require("../../utils");

describe("configRoleStrings()", () => {
	describe("When no roles in config", () => {
		test("Result should be users", async () => {
			//Assemble
			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId: 1,
			};
			permittedRoles = ["artists", "founders", "mods", "subs", "vips", "users"];

			//Act
			let result = configRoleStrings(config);

			//Assert
			expect(result[0]).toBe("isUser");
		});
	});

	describe("When roles in config", () => {
		test("Result should be users", async () => {
			//Assemble
			config = {
				isBroadcaster: false,
				displayName: "design_by_rose",
				channelId: 1,
				isArtist: true,
			};
			permittedRoles = ["artists", "founders", "mods", "subs", "vips", "users"];

			//Act
			let result = configRoleStrings(config);

			//Assert
			expect(result[0]).toBe("isArtist");
		});
	});
});
