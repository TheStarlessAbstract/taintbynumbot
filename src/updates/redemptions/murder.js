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
		name: "Sound Alert: I want to murder",
		type: "redemption",
		audio: [
			"https://res.cloudinary.com/hhghpd01d/video/upload/v1728078085/I_Want_To_Murder_ct1y6a.mp3",
		],
	});
}

module.exports = copyAndUpdate;
