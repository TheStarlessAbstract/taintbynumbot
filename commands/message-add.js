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
				let argumentText = config.argument;
				let existingMessage = await Message.findOne({
					twitchId: config.channelId,
					text: argumentText,
				});

				if (!existingMessage) {
					return "This Message has already been added";
				}

				let messageList = await Message.find({
					twitchId: config.channelId,
				}).sort({ index: 0 });

				let message = await Message.create({
					twitchId: config.channelId,
					index: messageList[messageList.length - 1].index + 1,
					text: argumentText,
					addedBy: config.userInfo.displayName,
				});

				messageList.push(message);
				chatClient.updateMessages(config.channelId, messageList);

				return `Message added - ${message.index}: ${message.text}`;
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				return "!addMessage command is for Mods only";
			} else if (!helper.isValuePresentAndString(config.argument)) {
				return "To add a Message use !addMessage [message output]";
			}
		},
	};
};

let versions = [
	{
		description: "Creates a new timed message",
		usage: "!addmessage DM @design_by_rose for all your dick graphic needs",
		usableBy: "mods",
		active: true,
	},
];

const addMessage = new BaseCommand(commandResponse, versions);

exports.command = addMessage;
