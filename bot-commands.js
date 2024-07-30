const BaseCommand = require("./src/classes/base-command");

const Command = require("./models/command");
const CommandNew = require("./src/models/commandnew");
const User = require("./models/user");

const defaultCommands = {};

// const audioTimeout = require("./commands/audiotimeout");
// const kings = require("./commands/kings");

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
	// kings: kings.command,
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
