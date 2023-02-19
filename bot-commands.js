const BaseCommand = require("./classes/base-command");

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
const messagesDelete = require("./commands/messages-delete");
const messagesEdit = require("./commands/messages-edit");
const messagesUpdate = require("./commands/messages-update");
const modAbuseAdd = require("./commands/modabuse-add");
const modAbuseDelete = require("./commands/modabuse-delete");
const modAbuseEdit = require("./commands/modabuse-edit");
const modAbuse = require("./commands/modabuse");
const points = require("./commands/points");
const quoteAdd = require("./commands/quote-add");
const quoteDelete = require("./commands/quote-delete");
const quoteEdit = require("./commands/quote-edit");
const quote = require("./commands/quote");
const so = require("./commands/so");
const tinderAdd = require("./commands/tinder-add");
const tinderEditAuthor = require("./commands/tinder-editauthor");
const tinder = require("./commands/tinder");
const title = require("./commands/title");

let chugLastUseTime = "";

const commands = {
	addcomm: commandAdd.command,
	addmessage: messagesAdd.command,
	addmodabuse: modAbuseAdd.command,
	addtinder: tinderAdd.command,
	addquote: quoteAdd.command,
	audiotimeout: audioTimeout.command,
	buhhs: buhhs.command,
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
	deaths: deaths.command,
	delcomm: commandDelete.command,
	delmessage: messagesDelete.command,
	delmodabuse: modAbuseDelete.command,
	delquote: quoteDelete.command,
	drinkbitch: drinkBitch.command,
	editcomm: commandEdit.command,
	editmessage: messagesEdit.command,
	editmodabuse: modAbuseEdit.command,
	editquote: quoteEdit.command,
	edittinderauthor: tinderEditAuthor.command,
	f: f.command,
	followage: followage.command,
	kingsremain: kingsRemain.command,
	kingsreset: kingsReset.command,
	kings: kings.command,
	lurk: lurk.command,
	modabuse: modAbuse.command,
	points: points.command,
	quote: quote.command,
	so: so.command,
	tinderquote: tinder.command,
	// title: title.command,
	updatemessages: messagesUpdate.command,
};

async function setup() {
	let chatCommands = await Command.find({});

	for (const command of chatCommands) {
		commands[command.name] = new BaseCommand(() => {
			return {
				response: command.text,
			};
		}, [
			{
				description: command.text,
				usage: "!" + command.name,
				usableBy: "users",
				active: true,
			},
		]);

		getCommands();
	}

	setCommandTimers();

	drinkBitch.updateAudioLinks();
	await f.setup();
}

function getCommands() {
	const commandList = Object.entries(commands).map(([key, value]) => {
		return { name: key, versions: value.getVersions() };
	});

	commandList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
	return commandList;
}

function setCommandTimers() {
	const currentDateTime = new Date();

	console.log(commands.drinkbitch);

	commands.drinkbitch.setTimer(currentDateTime);
	commands.points.setTimer(currentDateTime);
	commands.quote.setTimer(currentDateTime);
	commands.tinderquote.setTimer(currentDateTime);
	commands.modabuse.setTimer(currentDateTime);
	f.setTimer(currentDateTime);
	// chugLastUseTime = currentDateTime;
	commands.kingsremain.setTimer(currentDateTime);
}

exports.getCommands = getCommands;
exports.list = commands;
exports.setup = setup;
