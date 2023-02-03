const BaseCommand = require("../classes/base-command");

let commandResponse = () => {
	return {
		response:
			"buhhsbot is a super amazing bot made by the super amazing @asdfWENDYfdsa Go to https://www.twitch.tv/buhhsbot, and type !join in chat to have buhhsbot bootify your chat",
	};
};

let versions = [
	{
		description: "For the glory of buhhs",
		usage: "!buhhs",
		usableBy: "users",
		active: true,
	},
];

const buhhs = new BaseCommand(commandResponse, versions);

exports.command = buhhs;
