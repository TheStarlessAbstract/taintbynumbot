const fs = require("fs").promises;

const AudioLink = require("./models/audiolink");

let audioLinks;
let hydrateBooze;
let hydrateBoozeDivisor;
let hydrateBoozeTime;
let audioLink;
let canPlay = true;
let io;

async function setup(pubSubClient, userId, newIo) {
	io = newIo;
	const listener = await pubSubClient.onRedemption(userId, (message) => {
		if (message.rewardTitle == "Hydrate but with booze" && canPlay) {
			hydrateBooze++;
			if (
				message.userName == "clingell" &&
				(hydrateBooze % 5 === 0 ||
					new Date().getTime() - hydrateBoozeTime == 60000)
			) {
				playAudio();
			} else if (
				hydrateBooze % hydrateBoozeDivisor === 0 ||
				new Date().getTime() - hydrateBoozeTime == 120000
			) {
				playAudio();
			}
		} else {
		}
	});

	return listener;
}

function playAudio() {
	canPlay = false;
	audioLink = audioLinks.find((e) => e.name == "hiccup");
	io.emit("playAudio", audioLink.url);
	hydrateBoozeDivisor = getRandomBetween(5, 15);
	hydrateBoozeTime = new Date().getTime();
}

function setHydrateBooze() {
	canPlay = true;
	hydrateBooze = 0;
	hydrateBoozeDivisor = 1;
	hydrateBoozeTime = new Date().getTime();
}

function getRandomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

function setCanPlay() {
	canPlay = true;
}

exports.audioImport = audioImport;
exports.setup = setup;
exports.setHydrateBooze = setHydrateBooze;
exports.setCanPlay = setCanPlay;

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
