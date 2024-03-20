const audio = require("./bot-audio");
const quoteMeDirty = require("./redemptions/quote-me-dirty");
const twitchRepo = require("./repos/twitch");

const AudioLink = require("./models/audiolink");
const User = require("./models/user");

let audioLinks;
let lastAudioPlayed;
let audioLink;
let audioTimeout = false;
let audioTimeoutPeriod = 10000;
let audioTimeoutActive = false;
let redeemUser;

async function init() {
	let pubSubClient = twitchRepo.getPubSubClient();
	audioLinks = await AudioLink.find({});
	lastAudioPlayed = new Date().getTime();

	let users = await User.find({ role: { $ne: "bot" } }, "twitchId").exec();

	if (process.env.JEST_WORKER_ID == undefined) {
		for (let i = 0; i < users.length; i++) {
			await pubSubClient.onRedemption(users[i].twitchId, async (message) => {
				redeemUser = message.userName;
				audioLink = audioLinks.find(
					(element) => element.channelPointRedeem == message.rewardTitle
				);
				if (audioLink) {
					audio.play(audioLink.url);
				} else if (message.rewardTitle.includes("Quote me Dirty")) {
					quoteMeDirty.index(
						message.channelId,
						message.id,
						message.rewardId,
						message.userDisplayName
					);
				}
			});
		}
	}
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

exports.init = init;
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
