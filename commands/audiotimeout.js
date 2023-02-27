const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const audio = require("../bot-audio");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (helper.isValidModeratorOrStreamer(config)) {
				let time = helper.getCommandArgumentKey(config, 0);

				if (helper.isVersionActive(versions, 0) && time == null) {
					audio.setAudioTimeout();
					let status = audio.getAudioTimeout() ? "started" : "stopped";

					result.push("Bot audio timeout has been " + status);
				} else if (
					helper.isVersionActive(versions, 1) &&
					helper.isValuePresentAndNumber(time)
				) {
					switch (true) {
						case time === 0:
							if (audio.getAudioTimeout()) {
								result.push(
									"To stop the audioTimeout, use !audioTimeout without a number of seconds"
								);
							}
							break;
						case time > 0:
							audio.setAudioTimeout(time);

							result.push(
								"Bot audio timeout has been started, and set to " +
									time +
									" seconds"
							);
							break;
						case time < 1:
							result.push(
								"To use set the timeout length use postive number of seconds - !audiotimeout 10"
							);
							break;
						default:
							result.push(
								"To set the bot audio timeout length include the number of seconds for the timeout after the command: !audiotimeout 10"
							);
							break;
					}
				} else {
					result.push(
						"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!audioTimeout command is for Mods only");
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

const audioTimeout = new BaseCommand(commandResponse, versions);

exports.command = audioTimeout;
