const Helper = require("../../classes/helper.js");

const Command = require("../../models/command.js");
const CommandNew = require("../../models/commandnew.js");
const User = require("../../models/user.js");

const helper = new Helper();

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
				streamerId: activeCommands[j].streamerId,
				chatName: activeCommands[j].name,
				text: activeCommands[j].text,
				createdBy: activeCommands[j].createdBy, // convert to twitchId
				createdOn: activeCommands[j].createdOn,
				versions: new Map([
					[
						"noArguement",
						{
							description: activeCommands[j].text,
							active: true,
							minimumPermissionLevel: "users",
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
