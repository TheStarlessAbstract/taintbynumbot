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
		name: "Sound Alert: Boo this man",
		type: "redemption",
		audio: [
			"https://res.cloudinary.com/hhghpd01d/video/upload/v1728076922/Boo_This_Man_urcptu.mp3",
		],
	});
}

module.exports = copyAndUpdate;
