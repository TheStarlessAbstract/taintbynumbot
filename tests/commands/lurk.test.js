require("dotenv").config();

const lurk = require("../../commands/lurk");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = lurk.command;
const { response } = commandLink.getCommand();

describe.skip("lurk", () => {
	test("NoUserInfo_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = {};

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("HasUserInfo_ShouldReturnString", async () => {
		//Assemble
		userInfo = { displayName: "design_by_rose" };

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/@design_by_rose finds a comfortable spot/);
	});
});
