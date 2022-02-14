require("dotenv").config();

const axios = require("axios");
const fs = require("fs").promises;

const AudioLink = require("./models/audiolink");

let audioLinks;
let audioRedeemCounter;
let lastAudioPlayed;
let audioLink;
let url = process.env.BOT_DOMAIN;

async function setup(pubSubClient, userId) {
	const listener = await pubSubClient.onRedemption(userId, async (message) => {
		// for playing audio
		if (
			message.rewardTitle == "Hydrate but with booze" ||
			message.rewardTitle == "Hydrate!"
		) {
			audioRedeemCounter++;

			if (new Date().getTime() - lastAudioPlayed >= 120000) {
				audioLink = audioLinks.find(
					(element) => element.channelPointRedeem == message.rewardTitle
				);

				let resp = await axios.post(url + "/playaudio", { url: audioLink.url });
			}
		}
	});

	return listener;
}

function setHydrateBooze() {
	audioRedeemCounter = 0;
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

exports.audioImport = audioImport;
exports.setup = setup;
exports.setHydrateBooze = setHydrateBooze;

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
