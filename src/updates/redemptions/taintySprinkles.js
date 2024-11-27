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
		name: "Tainty Sprinkles",
		type: "redemption",
		output: new Map([
			[
				"text",
				{
					message: "Thank you for spreading your Tainty Sprinkles",
					active: true,
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
