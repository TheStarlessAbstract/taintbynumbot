const { splitArgs } = require("../../../utils/modify");
const { findOne, create } = require("./../../../queries/commands");
const { getChannel } = require("./../../../controllers/channels");

const addCommand = async function (config) {
	if (config.versionKey !== "addCommand") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	if (!config.argument.startsWith("!"))
		return this.getProcessedOutputString(
			this.getOutput("noPrefix"),
			config.configMap
		);

	const { first: commandName, second: text } = splitArgs(config.argument, 1);
	const name = commandName.toLowerCase();

	if (typeof text !== "string" || text.length === 0)
		return this.getProcessedOutputString(
			this.getOutput("noText"),
			config.configMap
		);

	const dbCommand = await findOne({
		channelId: this.channelId,
		chatName: name,
	});

	if (dbCommand)
		return this.getProcessedOutputString(
			this.getOutput("alreadyExists"),
			config.configMap
		);
	const type = "text";
	const output = new Map([
		[
			"text",
			{
				message: text,
				active: true,
			},
		],
	]);
	const versions = new Map([
		[
			"sayToChat",
			{
				isArgumentOptional: false,
				hasArgument: false,
				isArgumentNumber: false,
				description: text,
				active: true,
				usableBy: [
					"broadcaster",
					"artists",
					"founders",
					"mods",
					"subs",
					"vips",
					"viewers",
				],
				cooldown: {
					length: 0,
					lastUsed: new Date(),
					bypassRoles: ["broadcaster"],
				},
				cost: { active: false, points: 0, bypassRoles: ["broadcaster"] },
				hasAudioClip: false,
				luck: {
					active: false,
					odds: 100000,
				},
			},
		],
	]);

	await create({
		channelId: this.channelId,
		chatName: name,
		type,
		createdBy: config.userId,
		createdOn: new Date(),
		output,
		versions,
	});

	const channel = getChannel(this.channelId);
	channel.addTextCommand(name, type, output, versions);

	return this.getProcessedOutputString(
		this.getOutput("created"),
		config.configMap
	);
};

module.exports = addCommand;
