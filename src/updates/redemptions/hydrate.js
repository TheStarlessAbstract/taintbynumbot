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
		name: "Hydrate!",
		type: "redemption",
		audio: [
			"https://res.cloudinary.com/hhghpd01d/video/upload/v1644863581/more_water_fhqfsu.mp3",
		],
	});
}

module.exports = copyAndUpdate;
