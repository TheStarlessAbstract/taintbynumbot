const BaseCommand = require("../classes/base-command");
const BotCommand = require("../classes/bot-command");
const Helper = require("../classes/helper");

const db = require("./../bot-mongoose.js");
const CommandNew = require("../models/commandnew");
const Quote = require("../models/quote");

const helper = new Helper();
let lurk = {};
let users = {};

let commandResponse = () => {
	return {
		response: async (config) => {
			console.log("command");
			let userCommand = await CommandNew.findOne({
				streamerId: config.channelId,
				name: "lurk",
			});

			users[config.channelId] = { output: userCommand.output };

			if (
				helper.isValuePresentAndString(config.userInfo.displayName) &&
				!helper.isStreamer(config.userInfo)
			) {
				let output = eval(
					"`" + helper.getOutput(users, config.channelId, "isLurking") + "`"
				);

				return output;
			}
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

init();
async function init() {
	console.log("init: " + 1);
	console.log(db.getReadyState());
	let userCommand = await Quote.find({});
	for (let i = 0; i < userCommand.length; i++) {
		console.log(userCommand[i]);
	}
	console.log(userCommand);
	users = await helper.getCommandUsers("lurk");
	console.log("init: " + 2);
	lurk = new BotCommand(commandResponse, versions, users);
}

exports.command = lurk;
