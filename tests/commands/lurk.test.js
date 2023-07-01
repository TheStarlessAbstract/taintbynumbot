require("dotenv").config();

const lurk = require("../../commands/lurk");

let userInfo;
let commandLink = lurk.command;
const { response } = commandLink.getCommand();

describe("lurk", () => {
	test("IsBroadcasterIsFalse_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, displayName: "design_by_rose" };

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toMatch(/@design_by_rose finds a comfortable spot/);
	});

	test("IsBroadcasterIsTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { isBroadcaster: true, displayName: "TheStarlessAbstract" };

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});
});
