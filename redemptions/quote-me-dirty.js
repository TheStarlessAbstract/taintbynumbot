const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const botChatClient = require("../bot-chatclient");

const twitch = require("../services/twitch");
const twitchChannels = require("../services/twitch/channels");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;

async function index(channelId) {
	let chatClient = botChatClient.getChatClient();

	// check if active prediction
	// if active refund, and comment
	// else continue

	let channel = await twitchChannels.getChannelInfoById(channelId);

	let data1 = {
		autoLockAfter: 69,
		outcomes: ["Dirty", "Not Dirty"],
		title: "Will this quote be dirty?",
	};

	let response = await twitch.createPrediction(channelId, data1);

	if (!response) {
		return;
	}

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

	chatClient.say(
		`#${channel.displayName}`,
		"Time for another round of Quote me Dirty. Make your predictions now"
	);

	await helper.sleep(data1.autoLockAfter * 1000);

	chatClient.say(`#${channel.displayName}`, randomQuote[0].text);
}

exports.index = index;
