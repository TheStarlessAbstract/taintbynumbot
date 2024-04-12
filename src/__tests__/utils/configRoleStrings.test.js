require("dotenv").config();
const { configRoleStrings } = require("../../utils");

describe("configRoleStrings()", () => {
	test("should return an array of strings representing the roles when all boolean properties are true", () => {
		// Assemble
		const config = {
			isBroadcaster: true,
			isMod: true,
			isSub: true,
			isFounder: true,
			isArtist: true,
			isVip: true,
		};

		// Act
		const result = configRoleStrings(config);

		// Assert
		expect(result).toEqual([
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"subs",
			"vips",
		]);
	});

	test("should return an array of strings representing the roles when only one boolean property is true", () => {
		// Assemble
		const config = {
			isBroadcaster: false,
			isMod: false,
			isSub: false,
			isFounder: false,
			isArtist: true,
			isVip: false,
		};

		// Act
		const result = configRoleStrings(config);

		// Assert
		expect(result).toEqual(["artists"]);
	});

	test("should return an array of strings when all boolean properties are false", () => {
		// Assemble
		const config = {
			isBroadcaster: false,
			isMod: false,
			isSub: false,
			isFounder: false,
			isArtist: false,
			isVip: false,
		};

		// Act
		const result = configRoleStrings(config);

		// Assert
		expect(result).toEqual(["users"]);
	});
});
