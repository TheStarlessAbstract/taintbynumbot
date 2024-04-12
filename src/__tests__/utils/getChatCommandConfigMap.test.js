const { getChatCommandConfigMap } = require("../../utils");
const { chatCommandConfigMap } = require("../../config");

jest.mock("../../config", () => ({
	chatCommandConfigMap: jest.fn(),
}));

describe("getChatCommandConfigMap()", () => {
	let config;
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return a map object containing the chat command configuration when provided with a valid config object", () => {
		// Assemble
		const map = new Map([
			["displayName", ""],
			["channelId", ""],
			["isBroadcaster", ""],
		]);
		chatCommandConfigMap.mockReturnValue(map);

		const config = {
			channelId: "1",
			displayName: "TheStarlessAbstract",
			isBroadcaster: "true",
		};

		// Act
		const result = getChatCommandConfigMap(config);

		// Assert
		expect(result).toEqual(
			new Map([
				["displayName", "TheStarlessAbstract"],
				["channelId", "1"],
				["isBroadcaster", "true"],
			])
		);
	});

	test("should return undefined when provided with an empty config object", () => {
		// Assemble
		const map = new Map([
			["displayName", ""],
			["channelId", ""],
			["isBroadcaster", ""],
		]);
		chatCommandConfigMap.mockReturnValue(map);

		const config = {};

		// Act
		const result = getChatCommandConfigMap(config);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when provided with a null config object", () => {
		// Assemble
		const map = new Map([
			["displayName", ""],
			["channelId", ""],
			["isBroadcaster", ""],
		]);
		chatCommandConfigMap.mockReturnValue(map);

		const config = null;

		// Act
		const result = getChatCommandConfigMap(config);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when provided with a config object that is not an instance of Object", () => {
		// Assemble
		const map = new Map([
			["displayName", ""],
			["channelId", ""],
			["isBroadcaster", ""],
		]);
		chatCommandConfigMap.mockReturnValue(map);

		const config = "invalid";

		// Act
		const result = getChatCommandConfigMap(config);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should update the chat command configuration map with values from the config object", () => {
		// Assemble
		const mockConfig = { key1: "value1", key2: "value2" };
		const mockMap = new Map();
		mockMap.set("key1", "");
		mockMap.set("key2", "");
		chatCommandConfigMap.mockReturnValue(mockMap);

		// Act
		const result = getChatCommandConfigMap(mockConfig);

		// Assert
		expect(result.get("key1")).toEqual("value1");
		expect(result.get("key2")).toEqual("value2");
	});
});
