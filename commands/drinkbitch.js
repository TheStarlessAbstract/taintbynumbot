const BaseCommand = require("../classes/base-command");

const AudioLink = require("../models/audiolink");
const LoyaltyPoint = require("../models/loyaltypoint");

const audio = require("../bot-audio");

let audioLinks;
let COOLDOWN = 5000;
let cost = 500;
let timer;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let audioLink;
			let currentTime = new Date();

			if (
				isVersionActive(versions, 0) &&
				(isCooldownPassed(currentTime, timer, COOLDOWN) || isStreamer(config))
			) {
				timer = currentTime;

				let user = await LoyaltyPoint.findOne({
					userId: config.userInfo.userId,
				});

				if (user) {
					if (user.points > cost) {
						audioLink = getRandomisedAudioFileUrl(audioLinks);
						audio.play(audioLink);

						user.points -= cost;
						user.save();
						result.push("@TheStarlessAbstract drink, bitch!");
					} else {
						if (getRandomBetweenInclusiveMax(1, 100) == 100) {
							audioLink = getRandomisedAudioFileUrl(audioLinks);
							audio.play(audioLink);

							result.push(
								"@" +
									config.userInfo.displayName +
									" You lack the points to make Starless drink, but The Church of Latter-Day Taints takes pity on you. @TheStarlessAbstract drink, bitch!"
							);
						} else {
							result.push(
								"@" +
									config.userInfo.displayName +
									" You lack the points to make Starless drink, hang about stream if you have nothing better to do, and maybe you too can make Starless !drinkbitch"
							);
						}
					}
				} else {
					result.push(
						"@" +
							config.userInfo.displayName +
							" It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkbitch"
					);
				}
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Makes Starless drink booze",
		usage: "!drinkbitch",
		usableBy: "users",
		cost: "500 Tainty Points",
		active: true,
	},
];

const drinkBitch = new BaseCommand(commandResponse, versions);

function getRandomisedAudioFileUrl(array) {
	let index = getRandomBetweenExclusiveMax(0, array.length);
	let audioUrl = array[index].url;

	return audioUrl;
}

function getRandomBetweenExclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomBetweenInclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateAudioLinks() {
	audioLinks = await AudioLink.find({ command: "drinkbitch" }).exec();
}

function setTimer(newTimer) {
	timer = newTimer;
}

function isVersionActive(versionPack, index) {
	if (versionPack != undefined && versionPack.length > 0) {
		return versionPack[index]?.active ?? false;
	}
	return false;
}

function isCooldownPassed(currentTime, lastTimeSet, currentCooldown) {
	if (
		typeof currentTime == "string" ||
		typeof lastTimeSet == "string" ||
		typeof currentCooldown == "string" ||
		currentCooldown < 0
	) {
		return false;
	}
	return currentTime - lastTimeSet > currentCooldown;
}

function isStreamer(config) {
	return config.isBroadcaster;
}

exports.command = drinkBitch;
exports.setTimer = setTimer;
exports.updateAudioLinks = updateAudioLinks;
exports.isStreamer = isStreamer;
exports.isVersionActive = isVersionActive;
exports.isCooldownPassed = isCooldownPassed;
