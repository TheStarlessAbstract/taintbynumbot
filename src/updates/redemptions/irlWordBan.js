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
		name: "IRL word ban",
		type: "timer",
		output: new Map([
			[
				"interval",
				{
					message: "There is {remaining} seconds remaining for the Word Ban",
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
					message: "Starless, shut the fuck up",
					colour: "primary",
				},
			],
			[
				"end",
				{
					active: true,
					message: "Weep chat, for he can speak again",
					colour: "primary",
				},
			],
		]),
		interval: {
			active: true,
			duration: 20,
		},
		messageInput: {
			active: true,
			maxWordCount: 1,
			minWordCount: 1,
		},
	});
}

module.exports = copyAndUpdate;
