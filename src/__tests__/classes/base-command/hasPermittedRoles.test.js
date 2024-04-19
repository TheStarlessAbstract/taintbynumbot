const BaseCommand = require("../../../classes/base-command.js");
const { getUserRolesAsStrings, isBroadcaster } = require("../../../utils");

jest.mock("../../../utils", () => ({
	getUserRolesAsStrings: jest.fn(),
}));

describe("hasPermittedRoles()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return true when user has at least one of the permitted roles", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {
			isBroadcaster: true,
			isFounder: false,
			isArtist: false,
			isMod: false,
			isVip: false,
			isSub: false,
		};
		const permittedRoles = [
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"vips",
			"subs",
			"viewers",
		];

		getUserRolesAsStrings.mockReturnValue(["broadcaster"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).toHaveBeenCalled();
		expect(result).toBe(true);
	});

	test("should return false when user does not have any of the permitted roles", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {
			isBroadcaster: false,
			isFounder: false,
			isArtist: false,
			isMod: false,
			isVip: false,
			isSub: false,
		};
		const permittedRoles = [
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"vips",
			"subs",
		];

		getUserRolesAsStrings.mockReturnValue(["viewers"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).toHaveBeenCalled();
		expect(result).toBe(false);
	});

	test("should return true when user is missing some role properties, but has some permitted roles", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {
			isBroadcaster: true,
			isFounder: false,
			isArtist: false,
		};
		const permittedRoles = [
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"vips",
			"subs",
			"viewers",
		];

		getUserRolesAsStrings.mockReturnValue(["broadcaster"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).toHaveBeenCalled();
		expect(result).toBe(true);
	});

	test("should return false when user is missing all role properties, and viewers is not a permitted role", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {};
		const permittedRoles = [
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"vips",
			"subs",
		];

		getUserRolesAsStrings.mockReturnValue(["viewers"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).toHaveBeenCalled();
		expect(result).toBe(false);
	});

	test("should return true when user is missing all role properties, and viewers is not a permitted role", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {};
		const permittedRoles = [
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"vips",
			"viewers",
		];

		getUserRolesAsStrings.mockReturnValue(["viewers"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).toHaveBeenCalled();
		expect(result).toBe(true);
	});

	test("should return undefined when userRoles is not an object", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = 1;
		const permittedRoles = [
			"broadcaster",
			"founders",
			"artists",
			"mods",
			"vips",
			"subs",
			"viewers",
		];
		getUserRolesAsStrings.mockReturnValue(["viewers"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	test("should return undefined when permittedRoles is not an array", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {
			isBroadcaster: true,
			isFounder: false,
			isArtist: false,
			isMod: false,
			isVip: false,
			isSub: false,
		};
		const permittedRoles = {};

		getUserRolesAsStrings.mockReturnValue(["viewers"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	test("should return undefined when permittedRoles is an empty array", () => {
		// Assemble
		const testCommand = new BaseCommand();
		const userRoles = {
			isBroadcaster: true,
			isFounder: false,
			isArtist: false,
			isMod: false,
			isVip: false,
			isSub: false,
		};
		const permittedRoles = [];

		getUserRolesAsStrings.mockReturnValue(["viewers"]);

		// Act
		const result = testCommand.hasPermittedRoles(userRoles, permittedRoles);

		// Assert
		expect(getUserRolesAsStrings).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});
});
