const BaseCommand = require("../classes/base-command");

const audio = require("../bot-audio");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (isValidModeratorOrStreamer(config)) {
				let time = getCommandArgumentKey(config);

				if (isVersionActive(versions, 0) && time == null) {
					audio.setAudioTimeout();
					let status = audio.getAudioTimeout() ? "started" : "stopped";

					result.push(["Bot audio timeout has been " + status]);
				} else if (
					isVersionActive(versions, 1) &&
					isValuePresentAndNumber(time)
				) {
					switch (config.argument) {
						case config.argument > 0:
							audio.setAudioTimeout(time);

							result.push([
								"Bot audio timeout has been started, and set to " +
									time +
									" seconds",
							]);
							break;
						case config.argument < 1:
							result.push([
								"Please enter a positive number of seconds for the timeout after the command: !audiotimeout 10",
							]);
							break;
						default:
							result.push([
								"To set the bot audio timeout length include the number of seconds for the timeout after the command: !audiotimeout 10",
							]);
							break;
					}
				}
			} else if (!isValidModeratorOrStreamer(config)) {
				result.push(["!audiotimeout command is for Mods only"]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description:
			"Sets audio timeout for bot alerts to default length, or turns off the audio timeout",
		usage: "!audiotimeout",
		usableBy: "mods",
		active: true,
	},
	{
		description: "Sets the audio timeout to the specified amount of seconds",
		usage: "!audiotimeout 3",
		usableBy: "mods",
		active: true,
	},
];

function isValidModeratorOrStreamer(config) {
	return config.isBroadcaster || config.isModUp;
}

function isVersionActive(versionPack, index) {
	if (versionPack != undefined && versionPack.length > 0) {
		return versionPack[index]?.active ?? false;
	}
	return false;
}

function isValuePresentAndString(value) {
	return value != undefined && typeof value === "string" && value != "";
}

function isValuePresentAndNumber(value) {
	return value != undefined && typeof value === "number";
}

function getCommandArgumentKey(config) {
	if (isValuePresentAndString(config.argument) && !isNaN(config.argument)) {
		let value = Number(config.argument);

		return value;
	} else if (isValuePresentAndNumber(config.argument)) {
		return config.argument;
	} else if (config.argument == undefined) {
		return null;
	}
	return "";
}

const audioTimeout = new BaseCommand(commandResponse, versions);

exports.command = audioTimeout;
exports.isValidModeratorOrStreamer = isValidModeratorOrStreamer;
exports.isVersionActive = isVersionActive;
exports.isValuePresentAndString = isValuePresentAndString;
exports.isValuePresentAndNumber = isValuePresentAndNumber;
exports.getCommandArgumentKey = getCommandArgumentKey;
