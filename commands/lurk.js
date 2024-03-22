const BotCommand = require("../classes/bot-command");
const Helper = require("../classes/helper");

const CommandNew = require("../models/commandnew");

const helper = new Helper();
const users = {};

let commandResponse = () => {
	return {
		response: async (config) => {
			if (helper.isStreamer(config)) return;

			/////
			let userCommand = await CommandNew.findOne({
				streamerId: config.channelId,
				name: "lurk",
			});

			users[config.channelId] = { output: userCommand.output };
			//////

			let output = helper.getOutput(users[config.channelId], "isLurking");

			// check if matches regex here, if true continue, if false return output

			map = getMap(config);
			console.log(map);
			// {
			// 	displayName: config.displayName,
			// 	channelId: config.channelId,
			// 	channelName: config.channelName,
			// }

			// output = helper.processOutput(output, map);

			output = output.replace("{displayName}", config.displayName);

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

function processOutput(output, map) {
	const regex = /\{[^}]*\}/g;
	const matches = output.match(regex);
	if (!matches) return output;

	const uniqueMatches = [...new Set(matches)];
	// loop through unique matches and get replacement from map to update string

	return output;
}

function getMap(config) {
	const map = new Map([
		["displayName", ""],
		["channelId", ""],
		["isBroadcaster", ""],
	]);

	for (const key of map.keys()) {
		map.set(key, config[key]);
	}

	return map;
}

// 				displayName: config.displayName,
// 				channelId: config.channelId,
// 				channelName: config.channelName,

exports.command = lurk;
