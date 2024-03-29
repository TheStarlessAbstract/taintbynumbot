const TimerCommand = require("../../classes/timer-command");
const Helper = require("../../classes/helper");

const AudioLink = require("../../models/audiolink");
const LoyaltyPoint = require("../../models/loyaltypoint");

const audio = require("../../bot-audio");

const helper = new Helper();

let audioLinks;
let cooldown = 5000;
let cost = 500;

let commandResponse = async (config) => {
	let currentTime = new Date();

	if (
		!helper.isCooldownPassed(currentTime, command.timer, cooldown) &&
		!helper.isStreamer(config)
	)
		return;
	command.setTimer(currentTime);

	let user;

	if (!helper.isStreamer(config)) {
		user = await LoyaltyPoint.findOne({
			twitchId: config.channelId,
			userId: config.userId,
		}).exec();
	}

	const commandConfigMap = helper.getCommandConfigMap(config);

	if (!user && !helper.isStreamer(config)) {
		return helper.getProcessedOutputString(
			command.getChannel(config.channelId),
			"userNotInDatabase",
			commandConfigMap
		);
	}

	let audioLink;
	if (user.points >= cost || helper.isStreamer(config)) {
		///////// new audio player file to get url and send to play
		audioLink = helper.getRandomisedAudioFileUrl(audioLinks);

		if (!helper.isTest()) {
			audio.play(audioLink);
		}
		/////////
		user.points -= cost;
		await user.save();

		return helper.getProcessedOutputString(
			command.getChannel(config.channelId),
			"validBalance",
			commandConfigMap
		);
	}
	if (helper.getRandomBetweenInclusiveMax(1, 7) == 7) {
		////////////////
		audioLink = helper.getRandomisedAudioFileUrl(audioLinks);

		if (!helper.isTest()) {
			audio.play(audioLink);
		}
		////////////

		return helper.getProcessedOutputString(
			command.getChannel(config.channelId),
			"luckyShot",
			commandConfigMap
		);
	}

	return helper.getProcessedOutputString(
		command.getChannel(config.channelId),
		"invalidBalance",
		commandConfigMap
	);
};

// let versions = [
// 	{
// 		description: "Makes Starless drink booze",
// 		usage: "!drinkbitch",
// 		usableBy: "users",
// 		cost: "500 Tainty Points",
// 		active: true,
// 	},
// ];

const command = new TimerCommand(commandResponse, cooldown);

// async function updateAudioLinks() {
// 	audioLinks = await AudioLink.find({ command: "drinkbitch" });
// }

// exports.updateAudioLinks = updateAudioLinks;

module.exports = command;
