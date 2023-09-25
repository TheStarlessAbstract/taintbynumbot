const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const botChatClient = require("../bot-chatclient");

const twitch = require("../services/twitch");
const twitchChannels = require("../services/twitch/channels");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;

async function index(channelId) {
	let chatClient = botChatClient.getChatClient();
	let randomQuote = [];
	try {
		randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);

		if (randomQuote.length === 0) {
			console.log("No quotes found.");
		} else {
			console.log("Random Document:", randomQuote[0].text);
		}
	} catch (err) {
		randomQuote.push({ text: "" });
		console.error(err);
	}

	if (randomQuote[0].text === "") {
		return;
	}

	let channel = await twitchChannels.getChannelInfoById(channelId);

	chatClient.say(
		`#${channel.displayName}`,
		"Time for another round of Quote me Dirty. Have your say in the poll."
	);
	chatClient.say(`#${channel.displayName}`, randomQuote[0].text);

	let data = {
		channelPointsPerVote: 69,
		choices: ["Yes", "No"],
		duration: 69,
		title: "Was the quote dirty?",
	};

	await twitch.createPoll(channelId, data);
}

exports.index = index;
