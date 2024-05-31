const twitchRepo = require("../../../repos/twitch.js");

const say = async (channel, text, attributes, rateLimiterOptions) => {
	const chatClient = twitchRepo.getChatClient();
	let success = true;

	try {
		await chatClient.say(channel, text, attributes, rateLimiterOptions);
	} catch (err) {
		console.error(err);
		success = false;
	}

	return success;
};

module.exports = say;
