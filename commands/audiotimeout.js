const audio = require("../bot-audio");

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				// check if argument is a positive number
				if (!isNaN(config.argument) && config.argument > 0) {
					audio.setAudioTimeout(config.argument);
					result.push([
						"Bot audio timeout has been started, and set to " +
							config.argument +
							" seconds",
					]);
				} // check if argument is a negative number
				else if (!isNaN(config.argument) && config.argument < 1) {
					result.push([
						"Please enter a positive number of seconds for the timeout after the command: !audiotimeout 10",
					]);
				} else if (config.argument && isNaN(config.argument)) {
					result.push([
						"To set the bot audio timeout length include the number of seconds for the timeout after the command: !audiotimeout 10",
					]);
				} else {
					audio.setAudioTimeout();
					let status = audio.getAudioTimeout() ? "started" : "stopped";
					result.push(["Bot audio timeout has been " + status]);
				}
			} else if (!config.isModUp) {
				result.push(["!audiotimeout command is for Mods only"]);
			}

			return result;
		},
		versions: [
			{
				description:
					"Sets audio timeout for bot alerts to default length, or turns off the audio timeout",
				usage: "!audiotimeout",
				usableBy: "mods",
			},
			{
				description: "Sets the audio timeout to the specified about of seconds",
				usage: "!audiotimeout 3",
				usableBy: "mods",
			},
		],
	};
};

exports.getCommand = getCommand;
