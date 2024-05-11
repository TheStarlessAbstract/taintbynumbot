const BaseCommand = require("./src/classes/base-command");

const Command = require("./models/command");
const CommandNew = require("./src/models/commandnew");
const User = require("./models/user");

const defaultCommands = {};

// const audioTimeout = require("./commands/audiotimeout");
// const commandAdd = require("./commands/command-add");
// const commandDelete = require("./commands/command-delete");
// const commandEdit = require("./commands/command-edit");
// const deaths = require("./commands/deaths");
// const f = require("./commands/f");
// const kingsRemain = require("./commands/kings-remain");
// const kingsReset = require("./commands/kings-reset");
// const kings = require("./commands/kings");
// const messagesAdd = require("./commands/message-add");
// const messagesDelete = require("./commands/message-delete");
// const messagesEdit = require("./commands/message-edit");
// const quoteAdd = require("./commands/quote-add");
// const quoteDelete = require("./commands/quote-delete");
// const quoteEdit = require("./commands/quote-edit");
// const quote = require("./commands/quote");
// const song = require("./commands/song");
// const steam = require("./commands/steam");
// const tinderAdd = require("./commands/tinder-add");
// const tinderDelete = require("./commands/tinder-delete");
// const tinderEdit = require("./commands/tinder-edit");
// const tinder = require("./commands/tinder");

let chugLastUseTime = "";

const userCommands = {
	// 123: {
	// 	addcomm: commandAdd,
	// 	addmessage: messagesAdd.command,
	// },
	// 124: {
	// 	suck: commandAdd.command,
	// 	blow: messagesAdd.command,
	// },
};

const commands = {
	// addcomm: commandAdd.command,
	// addmessage: messagesAdd.command,
	// addtinder: tinderAdd.command,
	// addquote: quoteAdd.command,
	// audiotimeout: audioTimeout.command,
	// // chug: {
	// // 	response: async (config) => {
	// // 		let result = [];
	// // 		let cost = 5000;
	// // 		let currentTime = new Date();
	// // 		// limit per stream, limit per user
	// // 		if (currentTime - chugLastUseTime > 5000) {
	// // 			chugLastUseTime = currentTime;
	// // 			user = await LoyaltyPoint.findOne({
	// // 				userId: config.userInfo.userId,
	// // 			});
	// // 			if (user) {
	// // 				if (user.points >= cost) {
	// // 					user.points -= cost;
	// // 					user.save();
	// // 					// audio.play(getRandomBetweenExclusiveMax(0, drinkBitchAudioLinks.length));
	// // 					result.push("@TheStarlessAbstract chug, chug, chug!");
	// // 				} else {
	// // 					result.push(
	// // 						"@" +
	// // 							config.userInfo.displayName +
	// // 							" you do not have power within you, the power to make Starless chug, please try again later, or you know, don't"
	// // 					);
	// // 				}
	// // 			} else {
	// // 				result.push(
	// // 					"@" +
	// // 						config.userInfo.displayName +
	// // 						" It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !chug"
	// // 				);
	// // 			}
	// // 		}
	// // 		return result;
	// // 	},
	// // },
	// deaths: deaths.command,
	// delcomm: commandDelete.command,
	// delmessage: messagesDelete.command,
	// delquote: quoteDelete.command,
	// deltinder: tinderDelete.command,
	// editcomm: commandEdit.command,
	// editmessage: messagesEdit.command,
	// editquote: quoteEdit.command,
	// edittinder: tinderEdit.command,
	// f: f.command,
	// kingsremain: kingsRemain.command,
	// kingsreset: kingsReset.command,
	// kings: kings.command,
	// quote: quote.command,
	// song: song.command,
	// steam: steam.command,
	// tinderquote: tinder.command,
};

async function setup() {
	// find all users whose role is not "bot"
	let users = await User.find({ role: { $ne: "bot" } }, "twitchId").exec();
	let userIds = getUserIds(users);

	// loop though IDs to get all active commands for all users
	for (let i = 0; i < userIds.length; i++) {
		let activeCommands = await CommandNew.find({
			channelId: userIds[i],
			// active: true,
		});

		if (!activeCommands) continue;

		userCommands[userIds[i]] = {};

		// loop through commands add to userCommands
		for (let j = 0; j < activeCommands.length; j++) {
			if (activeCommands[j].type) {
				userCommands[userIds[i]][activeCommands[j].chatName] =
					defaultCommands[activeCommands[j].type];
			} else {
				userCommands[userIds[i]][activeCommands[j].chatName] = new BaseCommand(
					activeCommands[j].text
				);
			}
		}
	}

	// drinkBitch.updateAudioLinks();
	// await f.setup();
}

// for discord command display change to local query to database
function getCommands() {
	const commandList = Object.entries(commands).map(([key, value]) => {
		return { name: key, versions: value.getVersions() };
	});

	commandList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
	return commandList;
}

function getUserIds(users) {
	let userIds = [];

	for (let user of users) {
		userIds.push(user.twitchId);
	}

	return userIds;
}

exports.getCommands = getCommands;
exports.list = userCommands;
exports.setup = setup;
