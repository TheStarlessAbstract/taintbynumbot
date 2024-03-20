const mockingoose = require("mockingoose");
const lurk = require("../../commands/lurk");
const CommandNew = require("../../models/commandnew.js");

const commandLink = lurk.command;
const { response } = commandLink.getCommand();
let userInfo;
let channelId = process.env.TWITCH_USER_ID;

describe("lurk", () => {
	test("If chatter is not Broadcaster, should return string", async () => {
		const _doc = {
			channelId: channelId,
			name: "lurk",
			output: {
				isLurking: {
					message:
						"@[displayName] finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
				},
			},
		};

		mockingoose(CommandNew).toReturn(_doc, "findOne");

		//Assemble
		userInfo = { isBroadcaster: false, displayName: "design_by_rose" };

		//Act
		let result = await response({
			channelId,
			userInfo,
		});

		//Assert
		expect(result).toMatch(/@design_by_rose finds a comfortable spot/);
	});

	test("If chatter is Broadcaster, should return undefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, displayName: "TheStarlessAbstract" };

		//Act
		let result = await response({
			channelId,
			userInfo,
		});

		//Assert
		expect(result).toBeUndefined();
	});
});
