const twitchRepo = require("../repos/twitch");
const onMessage = require("../handlers/onMessageHandler");

let chatClient;

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

exports.init = init;
