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
	let listener;
	audioLinks = await AudioLink.find({});
	lastAudioPlayed = new Date().getTime();

	if (process.env.JEST_WORKER_ID == undefined) {
		listener = await pubSubClient.onRedemption(userId, async (message) => {
			redeemUser = message.userName;
			audioLink = audioLinks.find(
				(element) => element.channelPointRedeem == message.rewardTitle
			);
			if (audioLink) {
				audio.play(audioLink.url);
			}
		});
	}

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
