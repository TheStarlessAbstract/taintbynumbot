const Command = require("../../models/command.js"); // swap import with below when doing copy back to Command collection
const CommandNew = require("../models/commandnew.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new CommandNew({
		channelId: twitchId,
		chatName: "lurk",
		type: "text",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"text",
				{
					message:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
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
					description:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
					usableBy: ["artists", "founders", "mods", "subs", "vips", "viewers"],
					cooldown: { length: 0 },
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
