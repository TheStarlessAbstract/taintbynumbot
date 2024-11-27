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
		name: "Sound Alert: Wendy",
		type: "redemption",
		audio: [
			"https://res.cloudinary.com/hhghpd01d/video/upload/v1728074521/Shut_Up_Rose_xua6n0.mp3",
		],
	});
}

module.exports = copyAndUpdate;
