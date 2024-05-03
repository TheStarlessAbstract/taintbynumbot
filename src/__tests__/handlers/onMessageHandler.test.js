const onMessage = require("../../handlers/onMessageHandler.js");
const { findOne } = require("../../queries/commands");

jest.mock("../../queries/commands", () => ({
	findOne: jest.fn(),
}));

describe("onMessageHandler()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("test", async () => {
		const channelName = "TheStarlessAbstract";
		const user = "TaintByNumbot";
		const text = "!taint";
		const msg = {
			bits: 0,
			channelId: "69696969",
			date: new Date(),
			emoteOffsets: "",
			hypeChatAmount: 0,
			hypeChatCurrency: null,
			hypeChatDecimalPlaces: null,
			hypeChatIsSystemMessage: null,
			hypeChatLevel: null,
			hypeChatLocalizedAmount: null,
			id: "123456",
			isCheer: false,
			isFirst: false,
			isHighlight: false,
			isHypeChat: false,
			isRedemption: false,
			isReply: false,
			isReturningChatter: false,
			parentMessageId: null,
			parentMessageText: null,
			parentMessageUserDisplayName: null,
			parentMessageUserId: null,
			parentMessageUserName: null,
			rewardId: null,
			threadMessageId: null,
			threadMessageUserId: null,
			userInfo: {
				badgeInfo: new Map(),
				badges: new Map(),
				color: "black",
				displayName: "TaintByNumbot",
				isArtist: false,
				isBroadcaster: false,
				isFounder: false,
				isMod: false,
				isSubscriber: false,
				isVip: false,
				userId: "67890",
				userName: "taintbynumbot",
				userType: "user",
			},
		};

		findOne.mockResolvedValue({
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
			versions: new Map([
				[
					"noArgument", // string, number
					{
						isArgumentOptional: false,
						hasArgument: false,
						isArgumentNumber: false,
						description:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
						usableBy: [
							"artists",
							"founders",
							"mods",
							"subs",
							"vips",
							"users",
							"viewers",
						],
						// cooldown: { lastUsed: new Date(), length: 0 },
						// cost: 0,
					},
				],
			]),
			text: 1,
			type: "drinkbitch",
		});

		const result = await onMessage.handler(channelName, user, text, msg);

		expect(result).toBe(
			"@TaintByNumbot finds a comfortable spot behind the bushes to perv on the stream"
		);
	});
});
