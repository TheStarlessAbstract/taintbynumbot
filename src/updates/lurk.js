const Command = require("../../models/command.js"); // swap import with below when doing copy back to Command collection
const CommandNew = require("../../models/commandnew.js");

let twitchId = 100612361;

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new CommandNew({
		streamerId: twitchId,
		chatName: "lurk",
		defaultName: "lurk",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"isLurking",
				{
					message:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"noArguement",
				{
					description:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
					minimumPermissionLevel: "users",
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
