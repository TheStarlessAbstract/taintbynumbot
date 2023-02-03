const BaseCommand = require("../classes/base-command");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			result.push(
				config.userInfo.displayName +
					" finds a comfortable spot behind the bushes to perv on the stream"
			);

			return result;
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

const lurk = new BaseCommand(commandResponse, versions);

exports.command = lurk;
