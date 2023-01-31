const Command = require("./models/command");

const audioTimeout = require("./commands/audiotimeout");
const buhhs = require("./commands/buhhs");
const commandAdd = require("./commands/command-add");
const commandDelete = require("./commands/command-delete");
const commandEdit = require("./commands/command-edit");
const deaths = require("./commands/deaths");
const drinkBitch = require("./commands/drinkbitch");
const f = require("./commands/f");
const followage = require("./commands/followage");
const kingsRemain = require("./commands/kings-remain");
const kingsReset = require("./commands/kings-reset");
const kings = require("./commands/kings");
const lurk = require("./commands/lurk");
const messagesAdd = require("./commands/messages-add");
const messagesUpdate = require("./commands/messages-update");
const points = require("./commands/points");
const quoteAdd = require("./commands/quote-add");
const quote = require("./commands/quote");
const shoutout = require("./commands/shoutout");
const tinderAdd = require("./commands/tinder-add");
const tinderEditAuthor = require("./commands/tinder-editauthor");
const tinder = require("./commands/tinder");
const titleAdd = require("./commands/title-add");
const title = require("./commands/title");

let chugLastUseTime = "";

const commands = {
	addcomm: commandAdd,
	addmessage: messagesAdd,
	addtinder: tinderAdd,
	addtitle: titleAdd,
	addquote: quoteAdd,
	audiotimeout: audioTimeout,
	buhhs: buhhs,
	// chug: {
	// 	response: async (config) => {
	// 		let result = [];
	// 		let cost = 5000;

	// 		let currentTime = new Date();
	// 		// limit per stream, limit per user
	// 		if (currentTime - chugLastUseTime > 5000) {
	// 			chugLastUseTime = currentTime;

	// 			user = await LoyaltyPoint.findOne({
	// 				userId: config.userInfo.userId,
	// 			});

	// 			if (user) {
	// 				if (user.points >= cost) {
	// 					user.points -= cost;

	// 					user.save();

	// 					// audio.play(getRandomBetweenExclusiveMax(0, drinkBitchAudioLinks.length));

	// 					result.push("@TheStarlessAbstract chug, chug, chug!");
	// 				} else {
	// 					result.push(
	// 						"@" +
	// 							config.userInfo.displayName +
	// 							" you do not have power within you, the power to make Starless chug, please try again later, or you know, don't"
	// 					);
	// 				}
	// 			} else {
	// 				result.push(
	// 					"@" +
	// 						config.userInfo.displayName +
	// 						" It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !chug"
	// 				);
	// 			}
	// 		}

	// 		return result;
	// 	},
	// },
	deaths: deaths,
	delcomm: commandDelete,
	drinkbitch: drinkBitch,
	editcomm: commandEdit,
	edittinderauthor: tinderEditAuthor,
	f: f,
	followage: followage,
	kings: kings,
	kingsremain: kingsRemain,
	kingsreset: kingsReset,
	lurk: lurk,
	modabuse: title,
	points: points,
	so: shoutout,
	tinderquote: tinder,
	quote: quote,
	updatemessages: messagesUpdate,
};

async function setup() {
	let chatCommands = await Command.find({});

	for (const command of chatCommands) {
		commands[command.name] = { response: command.text };
	}

	setCommandTimers();

	drinkBitch.updateAudioLinks();
	await f.setup();
}

function getCommands() {
	const commandList = Object.entries(commands).map(([key, value]) => {
		return value.versions
			? { name: key, versions: value.versions }
			: {
					name: key,
					versions: [
						{
							description: value.response,
							usage: "!" + key,
							usableBy: "users",
						},
					],
			  };
	});

	commandList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
	return commandList;
}

function setCommandTimers() {
	const currentDateTime = new Date();

	drinkBitch.setTimer(currentDateTime);
	points.setTimer(currentDateTime);
	quote.setTimer(currentDateTime);
	tinder.setTimer(currentDateTime);
	title.setTimer(currentDateTime);
	f.setTimer(currentDateTime);
	// chugLastUseTime = currentDateTime;
	kings.setTimer(currentDateTime);
	kingsRemain.setTimer(currentDateTime);
}

exports.getCommands = getCommands;
exports.list = commands;
exports.setup = setup;
