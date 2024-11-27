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
		name: "Sound Alert: Rose",
		type: "redemption",
		audio: [
			"https://res.cloudinary.com/hhghpd01d/video/upload/v1728074557/Shut_Up_Wendy_xbbfmp.mp3",
		],
	});
}

module.exports = copyAndUpdate;
