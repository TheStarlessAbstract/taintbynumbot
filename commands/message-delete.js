const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const chatClient = require("../bot-chatclient");

const Message = require("../models/message");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			if (
				helper.isValidModeratorOrStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				if (!isNaN(config.argument)) {
					let index = config.argument;

					let message = await Message.findOne({
						twitchId: config.channelId,
						index: index,
					});

					if (!message) {
						return `No Message ${config.argument} found`;
					}

					await message.deleteOne();
					let messages = await Message.find({ twitchId: config.channelId });
					chatClient.updateMessages(config.channelId, messages);
					return `Message deleted - ${index} was: ${message.text}`;
				} else {
					return `!delMessage [index] - index is a number - !delMessage 69`;
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				return `!delMessage is for Mods only`;
			} else if (!helper.isValuePresentAndString(config.argument)) {
				return `To delete a Message use !delMessage [index]`;
			}
		},
	};
};

let versions = [
	{
		description: "Deletes an existing message using specified message number",
		usage: "!delMessage 69",
		usableBy: "mods",
		active: true,
	},
];

const deleteMessage = new BaseCommand(commandResponse, versions);

exports.command = deleteMessage;
