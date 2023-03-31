require("dotenv").config();

const lurk = require("../../commands/lurk");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = lurk.command;
const { response } = commandLink.getCommand();

describe("lurk", () => {
	test("IsBroadcasterFalse_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		userInfo = { displayName: "design_by_rose" };

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@design_by_rose finds a comfortable spot/);
	});

	test("IsBroadcasterTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		userInfo = { displayName: "TheStarlessAbstract" };

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});
});
