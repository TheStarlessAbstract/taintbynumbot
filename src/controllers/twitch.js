const twitchRepo = require("../repos/twitch");
const onMessage = require("../handlers/onMessageHandler");
const { start } = require("./loyalty");
const streamStatus = require("./streamStatus");

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
}

exports.init = init;
