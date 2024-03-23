require("dotenv").config();
const lurk = require("../../commands/lurk");
const CommandNew = require("../../models/commandnew");
const Helper = require("../../classes/helper");

const commandLink = lurk.command;
const { response } = commandLink.getCommand();
const channelId = process.env.TWITCH_USER_ID;
let config;

jest.mock("../../models/commandnew", () => ({
	findOne: jest.fn(),
}));
jest.mock("../../classes/helper", () => {
	const mockIsStreamer = jest.fn();
	const getOutput = jest.fn();
	return jest.fn(() => ({
		isStreamer: mockIsStreamer,
		getOutput: getOutput,
	}));
});
const helper = new Helper();

describe("lurk", () => {
	test("If chatter is not Broadcaster, should return string", async () => {
		//Assemble
		const _doc = {
			channelId: channelId,
			name: "lurk",
			output: new Map([
				[
					"isLurking",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
		};

		helper.isStreamer.mockReturnValue(false);
		helper.getOutput.mockReturnValue(
			"@{displayName} finds a comfortable spot behind the bushes to perv on the stream"
		);
		CommandNew.findOne.mockResolvedValue(_doc);

		config = { isBroadcaster: false, displayName: "design_by_rose", channelId };

		//Act
		let result = await response(config);

		//Assert
		expect(result).toBe(
			"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		);
	});

	test("If chatter is Broadcaster, should be undefined", async () => {
		//Assemble
		helper.isStreamer.mockReturnValue(true);
		config = {
			isBroadcaster: true,
			displayName: "TheStarlessAbstract",
			channelId,
		};

		//Act
		let result = await response(config);

		//Assert
		expect(result).toBeUndefined();
	});
});
