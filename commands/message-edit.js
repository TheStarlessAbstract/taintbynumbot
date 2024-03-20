const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const chatClient = require("../bot-chatclient");

const Message = require("../models/message");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let index = helper.getCommandArgumentKey(config.argument, 0);
				let text = helper.getCommandArgumentKey(config.argument, 1);

				if (
					helper.isValuePresentAndNumber(index) &&
					helper.isValuePresentAndString(text)
				) {
					let message = await Message.findOne({
						twitchId: config.channelId,
						index: index,
					});

					if (!message) {
						return `No Message number ${index} found`;
					}
					if (message.text == text) {
						return `Message ${index} already says: ${message.text}`;
					}

					result.push(`Message ${index} was: ${message.text}`);
					message.text = text;
					await message.save();

					let messages = await Message.find({ twitchId: config.channelId });
					chatClient.updateMessages(config.channelId, messages);

					result.push(`Message ${index} has been updated to: ${message.text}`);
				} else if (!helper.isValuePresentAndNumber(index)) {
					return "To edit a Message, you must include the index - !editMessage [index] [updated text]";
				} else if (!helper.isValuePresentAndString(text)) {
					return "To edit a Message, you must include the updated text - !editMessage [index] [updated text]";
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				return "!editMessage is for Mods only";
			} else if (!helper.isValuePresentAndString(config.argument)) {
				return "To edit a Message use !editMessage [index] [updated text]";
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edit an existing timed message",
		usage: "!editMessage 1 Rose needs to be stepped on, will you do it?",
		usableBy: "mods",
		active: true,
	},
];

const editMessage = new BaseCommand(commandResponse, versions);

exports.command = editMessage;
