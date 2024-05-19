const ChannelList = require("../classes/channelList.js");
const Channel = require("../classes/channel.js");

const twitchRepo = require("../repos/twitch");
const onMessage = require("../handlers/onMessageHandler");

let chatClient;
const channels = new ChannelList(); // ["channelID": {name: "", messageCount: #,commands:{}}]

function init() {
	chatClient = twitchRepo.getChatClient();
	chatClient.connect();

	chatClient.onAuthenticationSuccess(async () => {
		console.log("***Connnected to Twitch***");
	});

	chatClient.onMessage(async (channel, user, message, msg) => {
		onMessage.handler(channel, user, message, msg);
	});
}

function getChannel(channelId) {
	return channels.getChannel(channelId);
}

function addChannel() {
	channels.addChannel(new Channel());
}

exports.init = init;
