require("dotenv").config();

const lurk = require("../../commands/lurk");

let isBroadcaster;
let isModUp;
let userInfo;
let argument;
let commandLink = lurk.command;
const { response } = commandLink.getCommand();

describe("lurk", () => {
	test("UserInfoIncludesDisplayName_ShouldReturnShoutout", async () => {
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
		expect(
			result[0] ==
				"design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		).toBe(true);
	});
});
