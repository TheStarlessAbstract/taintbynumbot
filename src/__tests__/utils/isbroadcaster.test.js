const { isBroadcaster } = require("../../utils");

describe("isBroadcaster", () => {
	let config;

	beforeEach(async () => {
		config = {};
	});
	describe("When isBroadcaster() is true", () => {
		test("Result should be true", async () => {
			//Assemble
			config.isBroadcaster = true;

			//Act
			let result = isBroadcaster(config);

			expect(result).toBe(true);
		});
	});

	describe("When isBroadcaster() is false", () => {
		test("Result should be false", async () => {
			//Assemble
			config.isBroadcaster = false;

			//Act
			let result = isBroadcaster(config);

			//Assert
			expect(result).toBe(false);
		});
	});
});
