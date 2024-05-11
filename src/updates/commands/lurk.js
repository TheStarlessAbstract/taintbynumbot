// const Command = require("../../models/command.js");
const Command = require("../../models/commandnew.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new Command({
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
				"sayToChat",
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
