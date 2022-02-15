require("dotenv").config();

const axios = require("axios");
const fs = require("fs").promises;

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

async function setup(pubSubClient, userId) {
	const listener = await pubSubClient.onRedemption(userId, async (message) => {
		if (
			message.rewardTitle == "Hydrate but with booze" ||
			message.rewardTitle == "Hydrate!"
		) {
			if (new Date().getTime() - lastAudioPlayed >= 120000) {
				audioLink = audioLinks.find(
					(element) => element.channelPointRedeem == message.rewardTitle
				);

				let resp = await axios.post(url + "/playaudio", { url: audioLink.url });
			}
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

function setHydrateBooze() {
	lastAudioPlayed = new Date().getTime();
}

async function audioImport() {
	try {
		audioLinks = JSON.parse(
			await fs.readFile("./files/audioLinks.json", "UTF-8")
		);
	} catch (error) {
		audioLinks = await AudioLink.find({});
		if (audioLinks.length > 0) {
			await fs.writeFile(
				"./files/audioLinks.json",
				JSON.stringify(audioLinks, null, 4),
				"UTF-8"
			);
		}
	}
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

function getRandom() {
	return Math.floor(Math.random() * 100) + 1;
}

exports.audioImport = audioImport;
exports.setup = setup;
exports.setHydrateBooze = setHydrateBooze;
exports.setApiClient = setApiClient;
exports.setChatClient = setChatClient;

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
