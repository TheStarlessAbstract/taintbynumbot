const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const AudioLink = require("../models/audiolink");
const LoyaltyPoint = require("../models/loyaltypoint");

const audio = require("../bot-audio");

const helper = new Helper();

let audioLinks;
let cooldown = 5000;
let cost = 500;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				helper.isCooldownPassed(currentTime, drinkBitch.timer, cooldown) ||
				helper.isStreamer(config.userInfo)
			) {
				drinkBitch.setTimer(currentTime);
				let user = await LoyaltyPoint.findOne({
					userId: config.userInfo.userId,
				});

				if (user) {
					let audioLink;
					if (user.points > cost) {
						audioLink = helper.getRandomisedAudioFileUrl(audioLinks);

						if (!helper.isTest()) {
							audio.play(audioLink);
						}

						user.points -= cost;
						await user.save();
						result.push("@TheStarlessAbstract drink, bitch!");
					} else {
						if (helper.getRandomBetweenInclusiveMax(1, 100) == 100) {
							audioLink = helper.getRandomisedAudioFileUrl(audioLinks);

							if (!helper.isTest()) {
								audio.play(audioLink);
							}

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

const drinkBitch = new TimerCommand(commandResponse, versions, cooldown);

async function updateAudioLinks() {
	audioLinks = await AudioLink.find({ command: "drinkbitch" });
}

exports.command = drinkBitch;
exports.updateAudioLinks = updateAudioLinks;
