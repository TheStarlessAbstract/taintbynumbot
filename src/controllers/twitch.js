const twitchRepo = require("../repos/twitch");
const onMessage = require("../handlers/onMessageHandler");
const streamStatus = require("./streamStatus");
const pubSub = require("./pubSub");

let chatClient;

function init() {
	chatClient = twitchRepo.getChatClient();
	chatClient.connect();

	chatClient.onAuthenticationSuccess(async () => {
		console.log("***Connnected to Twitch***");

		streamStatus.init();
	});

	chatClient.onMessage(async (channel, user, message, msg) => {
		onMessage.handler(channel, user, message, msg);
	});

	pubSub.init();
}

exports.init = init;
