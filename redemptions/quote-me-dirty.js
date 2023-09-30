const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const botChatClient = require("../bot-chatclient");

const twitch = require("../services/twitch");
const twitchChannels = require("../services/twitch/channels");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;

async function index(channelId, redemptionId, rewardId, displayName) {
	let chatClient = botChatClient.getChatClient();

	let predictions = await twitch.getPredictions(channelId);
	let channel = await twitchChannels.getChannelInfoById(channelId);

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

		chatClient.say(
			`#${channel.displayName}`,
			`@${displayName}, there is a prediction waiting to be resolved, your channel points have been refunded`
		);

		return;
	}

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

		chatClient.say(
			`#${channel.displayName}`,
			`@${displayName}, something went wrong setting up the prediction, your channel points have been refunded`
		);

		return;
	}

	let randomQuote = [];
	try {
		randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
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

		chatClient.say(
			`#${channel.displayName}`,
			`@${displayName}, no quotes found, your channel points have been refunded`
		);

		return;
	}

	chatClient.say(
		`#${channel.displayName}`,
		"Time for another round of Quote me Dirty. Make your predictions now"
	);

	await helper.sleep(data.autoLockAfter * 1000);

	twitch.sendAnnouncement(channelId, {
		color: "primary",
		message: randomQuote[0].text,
	});

	chatClient.say(`#${channel.displayName}`, randomQuote[0].text);

	twitch.updateRedemptionStatusByIds(
		channelId,
		rewardId,
		redemptionId,
		"FULFILLED"
	);
}

exports.index = index;
