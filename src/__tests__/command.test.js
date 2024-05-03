const BaseCommand = require("../classes/baseCommand");

describe("command", () => {
	afterEach(() => {});

	test("a test", async () => {
		const channelId = "1234";
		const name = "TheStarlessAbstract";
		const type = "text";
		const output = {};
		const versions = {};

		const command = (config) => {
			if (config.versionKey !== "noArgument") return;
			versions.get(config.versionKey);

			const output = commandIns.getProcessedOutputString(
				config.output.get("text"),
				config.configMap
			);
			if (!output) return;

			return output;
		};

		const commandIns = new BaseCommand(
			channelId,
			name,
			type,
			output,
			versions,
			command
		);

		const config = {
			isBroadcaster: false,
			displayName: "design_by_rose",
			channelId: "1",
			versionKey: "noArgument",
			output: new Map([
				[
					"text",
					{
						message:
							"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
						active: true,
					},
				],
			]),
			configMap: new Map([
				["displayName", "design_by_rose"],
				["channelId", "1"],
				["isBroadcaster", false],
			]),
		};

		const reference = commandIns.getCommand();

		// Act
		const result = await reference(config);

		// Assert
		expect(result).toBe(
			"@design_by_rose finds a comfortable spot behind the bushes to perv on the stream"
		);
	});
});
