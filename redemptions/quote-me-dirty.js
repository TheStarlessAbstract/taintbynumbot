const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const botChatClient = require("../bot-chatclient");

const twitch = require("../services/twitch");
const twitchChannels = require("../services/twitch/channels");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;

async function index(channelId, redemptionId, rewardId) {
	let chatClient = botChatClient.getChatClient();

	let predictions = await twitch.getPredictions(channelId);

	if (
		predictions == null ||
		predictions.data[0].status == "ACTIVE" ||
		predictions.data[0].status == "LOCKED"
	) {
		twitch.updateRedemptionStatusByIds(
			channelId,
			rewardId,
			redemptionId,
			"CANCELED"
		);

		return;
	}

	let channel = await twitchChannels.getChannelInfoById(channelId);

	let data = {
		autoLockAfter: 69,
		outcomes: ["Tainted", "Not Tainted"],
		title: "How filthy did my mods twist my words?",
	};

	let prediction = await twitch.createPrediction(channelId, data);

	if (!prediction) {
		twitch.updateRedemptionStatusByIds(
			channelId,
			rewardId,
			redemptionId,
			"CANCELED"
		);

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
		twitch.updateRedemptionStatusByIds(
			channelId,
			rewardId,
			redemptionId,
			"CANCELED"
		);
		twitch.cancelPrediction(channelId, prediction.id);

		return;
	}

	chatClient.say(
		`#${channel.displayName}`,
		"Time for another round of Quote me Dirty. Make your predictions now"
	);

	await helper.sleep(data.autoLockAfter * 1000);

	chatClient.say(`#${channel.displayName}`, randomQuote[0].text);

	twitch.updateRedemptionStatusByIds(
		channelId,
		rewardId,
		redemptionId,
		"FULFILLED"
	);
}

exports.index = index;
