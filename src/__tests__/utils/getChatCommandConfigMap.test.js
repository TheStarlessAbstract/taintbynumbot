const { getChatCommandConfigMap } = require("../../utils");
const { chatCommandConfigMap } = require("../../config");

jest.mock("../../config", () => ({
	chatCommandConfigMap: jest.fn(),
}));

describe("getChatCommandConfigMap", () => {
	let config;

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe("When chatCommandConfigMap is not an instance of Map", () => {
		test("Result should be undefined", async () => {
			//Assemble
			chatCommandConfigMap.mockReturnValue(undefined);

			config = {
				channelId: "1",
				displayName: "TheStarlessAbstract",
				isBroadcaster: true,
			};

			//Act
			let result = getChatCommandConfigMap(config);

			//Assert
			expect(result).toBeUndefined();
		});
	});
	describe("When chatCommandConfigMap is an instance of Map", () => {
		describe("And at least one key in chatCommandConfigMap does not match a property in config", () => {
			test("Result should be undefined", async () => {
				//Assemble
				const map = new Map([
					["a", ""],
					["channelId", ""],
					["isBroadcaster", ""],
				]);
				chatCommandConfigMap.mockReturnValue(map);

				config = {
					channelId: "1",
					displayName: "TheStarlessAbstract",
					isBroadcaster: true,
				};

				//Act
				let result = getChatCommandConfigMap(config);

				//Assert
				expect(result).toBeUndefined();
			});
		});

		describe("And all keys in chatCommandConfigMap match properties in config", () => {
			test("Result should be undefined", async () => {
				//Assemble
				const map = new Map([
					["displayName", ""],
					["channelId", ""],
					["isBroadcaster", ""],
				]);
				chatCommandConfigMap.mockReturnValue(map);

				config = {
					channelId: "1",
					displayName: "TheStarlessAbstract",
					isBroadcaster: "true",
				};

				//Act
				let result = getChatCommandConfigMap(config);

				//Assert
				expect(result).toEqual(
					new Map([
						["displayName", "TheStarlessAbstract"],
						["channelId", "1"],
						["isBroadcaster", "true"],
					])
				);
			});
		});
	});
});
