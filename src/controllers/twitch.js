const twitchRepo = require("../repos/twitch");
const onMessage = require("../handlers/onMessageHandler");
const { start } = require("./loyalty");

let chatClient;

function init() {
	chatClient = twitchRepo.getChatClient();
	chatClient.connect();

	chatClient.onAuthenticationSuccess(async () => {
		console.log("***Connnected to Twitch***");

		//check if channels are live or not live

		// start loyalty here
		start();
	});

	chatClient.onMessage(async (channel, user, message, msg) => {
		onMessage.handler(channel, user, message, msg);
	});
}

exports.init = init;
