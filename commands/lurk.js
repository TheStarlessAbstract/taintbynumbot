const BaseCommand = require("../classes/base-command");
const BotCommand = require("../classes/bot-command");
const Helper = require("../classes/helper");

const CommandNew = require("../models/commandnew");

const helper = new Helper();
const users = {};

let commandResponse = () => {
	return {
		response: async (config) => {
			if (helper.isStreamer(config.userInfo)) return;

			let userCommand = await CommandNew.findOne({
				streamerId: config.channelId,
				name: "lurk",
			});

			users[config.channelId] = { output: userCommand.output };

			let output = helper.getOutput(users, config.channelId, "isLurking");
			output = output.replace("[displayName]", config.userInfo.displayName);

			return output;
		},
	};
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

const lurk = new BotCommand(commandResponse, versions, users);

exports.command = lurk;
