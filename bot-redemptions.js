const audio = require("./bot-audio");

const axios = require("axios");

const AudioLink = require("./models/audiolink");

let audioLinks;
let lastAudioPlayed;
let audioLink;
let url = process.env.BOT_DOMAIN;
let apiClient;
let twitchId = process.env.TWITCH_USER_ID;
let twitchUsername = process.env.TWITCH_USERNAME;
let higherLower = getRandom();
let predictionWinner;
let chatClient;
let audioTimeout = false;
let audioTimeoutPeriod = 10000;
let audioTimeoutActive = false;
let redeemUser;

async function setup(pubSubClient, userId) {
	audioLinks = await AudioLink.find({});
	lastAudioPlayed = new Date().getTime();

	const listener = await pubSubClient.onRedemption(userId, async (message) => {
		redeemUser = message.userName;
		audioLink = audioLinks.find(
			(element) => element.channelPointRedeem == message.rewardTitle
		);

		if (audioLink) {
			audio.play(audioLink.url);
		} else if (message.rewardTitle.includes("Higher or Lower")) {
			let latestPredictions = await apiClient.predictions
				.getPredictionsPaginated(twitchId)
				.getNext();

			if (
				latestPredictions[0].status != "LOCKED" &&
				latestPredictions[0].status != "ACTIVE"
			) {
				let prediction = await apiClient.predictions.createPrediction(
					twitchId,
					{
						autoLockAfter: 30,
						outcomes: ["Higher", "Lower"],
						title: "Higher or Lower than " + higherLower,
					}
				);
				setTimeout(async () => {
					let newRoll = getRandom();
					while (newRoll == higherLower) {
						newRoll = getRandom();
					}
					if (newRoll > higherLower) {
						predictionWinner = prediction.outcomes.find(
							(outcome) => outcome.title == "Higher"
						);
					} else if (newRoll < higherLower) {
						predictionWinner = prediction.outcomes.find(
							(outcome) => outcome.title == "Lower"
						);
					}
					higherLower = newRoll;

					await apiClient.predictions.resolvePrediction(
						twitchId,
						prediction.id,
						predictionWinner.id
					);

					chatClient.say(
						twitchUsername,
						" The result is in, we rolled a " + higherLower
					);

					await apiClient.channelPoints.updateCustomReward(
						twitchId,
						message.rewardId,
						{ title: "Higher or Lower: " + higherLower }
					);
				}, 32000);
			} else {
				await apiClient.channelPoints.updateRedemptionStatusByIds(
					twitchId,
					message.rewardId,
					[message.id],
					"CANCELED"
				);

				chatClient.say(
					twitchUsername,
					"@" +
						message.userDisplayName +
						" there is already a prediction ongoing, try again later"
				);
			}
		}
	});

	let rewards = await apiClient.channelPoints.getCustomRewards(twitchId);
	let reward = rewards.find((r) => r.title.includes("Higher or Lower"));
	await apiClient.channelPoints.updateCustomReward(twitchId, reward.id, {
		title: "Higher or Lower: " + higherLower,
	});

	return listener;
}

async function setApiClient(newApiClient) {
	apiClient = newApiClient;

	// await apiClient.channelPoints.createCustomReward(twitchId, {
	// 	cost: 1,
	// 	title: "Higher or Lower than " + higherLower,
	// 	autoFullfill: false,
	// 	backgroundColor: "#392e5c",
	// 	globalCooldown: null,
	// 	isEnabled: true,
	// 	maxRedemptionsPerStream: null,
	// 	maxRedemptionsPerUserPerStream: null,
	// 	prompt: "Come gamble your Taintified Essence",
	// 	userInputRequired: false,
	// });
}

function setChatClient(newChatClient) {
	chatClient = newChatClient;
}

function getAudioTimeout() {
	return audioTimeout;
}

function setAudioTimeout(newAudioTimeoutPeriod) {
	audioTimeoutPeriod = newAudioTimeoutPeriod * 1000 || 10000;
	if (audioTimeout) {
		audioTimeout = false;
	} else {
		audioTimeout = true;
	}
}

function getRandom() {
	return Math.floor(Math.random() * 100) + 1;
}

function getRandomBetween(max, min) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.setup = setup;
exports.setApiClient = setApiClient;
exports.setChatClient = setChatClient;
exports.getAudioTimeout = getAudioTimeout;
exports.setAudioTimeout = setAudioTimeout;

// let test = {
//     channelId: message.channelId,
//     id: message.id,
//     message: message.message,
//     redemptionDate: message.redemptionDate,
//     rewardCost: message.rewardCost,
//     rewardId: message.rewardId,
//     rewardIsQueued: message.rewardIsQueued,
//     rewardPrompt: message.rewardPrompt,
//     rewardTitle: message.rewardTitle,
//     status: message.status,
//     userDisplayName: message.userDisplayName,
//     userId: message.userId,
//     userName: message.userName,
// };
