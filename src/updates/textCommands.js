const Command = require("../../models/command.js");
const CommandNew = require("../models/commandnew.js");
const User = require("../../models/user.js");
const Helper = require("../../classes/helper.js");
const helper = new Helper();

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

async function copyAndUpdate() {
	let users = await User.find({ role: { $ne: "bot" } }, "twitchId").exec();
	let userIds = helper.getUserIds(users);

	for (let i = 0; i < userIds.length; i++) {
		let activeCommands = await Command.find({
			streamerId: userIds[i],
		});

		let list = [];
		for (let j = 0; j < activeCommands.length; j++) {
			list.push({
				channelId: activeCommands[j].streamerId,
				chatName: activeCommands[j].name,
				type: "text",
				createdBy: activeCommands[j].createdBy,
				createdOn: activeCommands[j].createdOn,
				output: new Map([
					[
						"text",
						{
							message: activeCommands[j].text,
							active: true,
						},
					],
				]),
				versions: new Map([
					[
						"noArgument",
						{
							isArgumentOptional: false,
							hasArgument: false,
							isArgumentNumber: false,
							description: activeCommands[j].text,
							active: true,
							usableBy: [
								"broadcaster",
								"artists",
								"founders",
								"mods",
								"subs",
								"vips",
								"viewers",
							],
							cooldown: {
								length: 0,
								lastUsed: new Date(),
								bypassRoles: ["broadcaster"],
							},
							cost: { active: false, points: 0, bypassRoles: ["broadcaster"] },
							hasAudioClip: false,
							luck: {
								active: false,
								odds: 100000,
							},
						},
					],
				]),
			});
		}
		await CommandNew.insertMany(list);
	}
}

async function copyBack() {}

module.exports = copyAndUpdate;
