const BotCommand = require("../classes/bot-command");
const Helper = require("../classes/helper");
const CommandNew = require("../models/commandnew");
const helper = new Helper();

const commandResponse = async (config) => {
	if (helper.isStreamer(config)) return;

	if (!command.getUser[config.channelId]) {
		const userCommand = await CommandNew.findOne({
			streamerId: config.channelId,
			name: "lurk",
		});
		if (!userCommand) return;
		command.addUser(config.channelId, {
			output: userCommand.output,
			versions: userCommand.versions,
		});
	}

	let isLurkingString = helper.getOutput(
		command.getUser(config.channelId),
		"isLurking"
	);

	if (!isLurkingString) return;

	const commandConfigMap = helper.getCommandConfigMap(config);
	isLurkingString = helper.processOutputString(
		isLurkingString,
		commandConfigMap
	);

	return isLurkingString;
};

let versions = [
	{
		description:
			"Let the stream know you are going to lurk for a while...please come back",
		usage: "!lurk",
		usableBy: "users",
		active: true,
	},
];

const command = new BotCommand(commandResponse, versions);

module.exports = command;
