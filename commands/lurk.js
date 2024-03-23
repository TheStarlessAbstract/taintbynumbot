const BotCommand = require("../classes/bot-command");
const Helper = require("../classes/helper");
const CommandNew = require("../models/commandnew");
const helper = new Helper();

let commandResponse = async (config) => {
	if (helper.isStreamer(config)) return;

	if (!command.getUser[config.channelId]) {
		let userCommand = await CommandNew.findOne({
			streamerId: config.channelId,
			name: "lurk",
		});
		if (!userCommand) return;
		command.addUser(config.channelId, { output: userCommand.output });
	}

	let isLurkingString = helper.getOutput(
		command.getUser(config.channelId),
		"isLurking"
	);

	const configMap = getConfigMap(config);
	isLurkingString = processOutputString(isLurkingString, configMap);

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

function processOutputString(outputString, map) {
	const regex = /\{[^}]*\}/g;
	const keysInOutputString = outputString.match(regex);
	if (!keysInOutputString) return outputString;

	const uniqueKeysInOutputString = [...new Set(keysInOutputString)];
	const cleanedArrayOfKeys = removeCurlyBracesFromStringArray(
		uniqueKeysInOutputString
	);

	for (let i = 0; i < cleanedArrayOfKeys.length; i++) {
		outputString = outputString.replaceAll(
			`{${cleanedArrayOfKeys[i]}}`,
			map.get(cleanedArrayOfKeys[i])
		);
	}

	return outputString;
}

function removeCurlyBracesFromStringArray(stringArray) {
	return stringArray.map((string) => string.substring(1, string.length - 1));
}

function getConfigMap(config) {
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

module.exports = command;
