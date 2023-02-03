const BaseCommand = require("../classes/base-command");

const audio = require("../bot-audio");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				if (audioTimeout.versions[0].active && !config.argument) {
					audio.setAudioTimeout();
					let status = audio.getAudioTimeout() ? "started" : "stopped";
					result.push(["Bot audio timeout has been " + status]);
				} else if (audioTimeout.versions[1].active && config.argument) {
					switch (config.argument) {
						case config.argument > 0:
							audio.setAudioTimeout(config.argument);
							result.push([
								"Bot audio timeout has been started, and set to " +
									config.argument +
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
			} else if (!config.isModUp) {
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

const audioTimeout = new BaseCommand(commandResponse, versions);

exports.command = audioTimeout;
