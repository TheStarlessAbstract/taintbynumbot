const Redemption = require("../../models/redemptions");

let twitchId = "100612361";

async function copyAndUpdate() {
	let redeem = template();
	await redeem.save();
}

function template() {
	return new Redemption({
		channelId: twitchId,
		channelName: "TheStarlessAbstract",
		name: "IRL voice ban",
		type: "timer",
		output: new Map([
			[
				"interval",
				{
					message: "There is {remaining} remaining for the Voice Ban",
					active: true,
				},
			],
		]),
		duration: 60,
		audio: [],
		announcements: new Map([
			[
				"start",
				{
					active: true,
					message:
						"Starless, shut the fuck up - @{user} has banned Starless from speaking for {duration}",
					colour: "primary",
				},
			],
			[
				"end",
				{
					active: true,
					message:
						"Weep chat, for Starless can speak again - Thank you @{user} for giving us some taint and quiet",
					colour: "primary",
				},
			],
		]),
		interval: {
			active: true,
			duration: 20,
		},
	});
}

module.exports = copyAndUpdate;
