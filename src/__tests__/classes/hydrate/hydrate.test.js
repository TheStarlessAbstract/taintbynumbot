const Hydrate = require("../../../classes/commands/hydrate.js");

describe("command", () => {
	afterEach(() => {});

	test("a test", async () => {
		const channelId = "1234";
		const name = "TheStarlessAbstract";
		const type = "hydrate";
		const output = new Map([
			[
				"text",
				{
					message:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
				},
			],
		]);
		const versions = {};
		const hydrate = new Hydrate(channelId, name, { type, output, versions });
		const config = {
			channelId: "100612361",
			userId: "100612361",
			username: "thestarlessabstract",
			chatName: "drinkbitch",
			versionKey: "noArgument",
			user: {
				channelId: "100612361",
				viewerId: "100612361",
				points: 1200,
				follower: false,
				__v: 0,
			},
			bypass: true,
			userCanPayCost: true,
			configMap: new Map([
				["channelName", "thestarlessabstract"],
				["displayName", "TheStarlessAbstract"],
				["gameName", undefined],
				["channelId", "100612361"],
				["isBroadcaster", true],
			]),
		};
		const action = hydrate.getAction();

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		);
	});
});
