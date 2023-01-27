const AudioLink = require("../models/audiolink");
const LoyaltyPoint = require("../models/loyaltypoint");

const audio = require("../bot-audio");

let audioLinks;
let COOLDOWN = 5000;
let cost = 500;
let timer;

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];
			let audioLink;
			let currentTime = new Date();

			try {
				if (currentTime - timer < COOLDOWN) {
					throw new Error("Wait longer");
				}

				let user = await LoyaltyPoint.findOne({
					userId: config.userInfo.userId,
				});

				if (!user) {
					throw new Error("No user found");
				}

				if (user.points < cost) {
					throw new Error("Not enough points");
				}

				timer = currentTime;

				audioLink = getRandomisedAudioFileUrl(audioLinks);
				audio.play(audioLink);

				user.points -= cost;
				user.save();
				result.push("@TheStarlessAbstract drink, bitch!");
			} catch (error) {
				if (error == "No user found") {
					result.push(
						"@" +
							config.userInfo.displayName +
							" It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkbitch"
					);
				} else if (error == "Not enough points") {
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
			}

			return result;
		},
		versions: [
			{
				description: "Makes Starless drink booze",
				usage: "!drinkbitch",
				usableBy: "users",
				cost: "500 Tainty Points",
			},
		],
	};
};

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

exports.getCommand = getCommand;
exports.setTimer = setTimer;
exports.updateAudioLinks = updateAudioLinks;
