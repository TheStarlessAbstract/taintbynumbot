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
		name: "Quote me Dirty",
		type: "listPrediction",
		listCategory: "quote",
		output: new Map([
			[
				"existing",
				{
					message:
						"@{displayName}, there is a prediction waiting to be resolved, your channel points have been refunded",
					active: true,
				},
			],
			[
				"errorCreatingPrediction",
				{
					message:
						"@{displayName}, something went wrong setting up the prediction, your channel points have been refunded",
					active: true,
				},
			],
			[
				"noListItemFound",
				{
					message:
						"@{displayName}, no quotes found, your channel points have been refunded",
					active: true,
				},
			],
			[
				"startedPrediction",
				{
					message:
						"Time for another round of Quote Me Dirty. Make your predictions now",
					active: true,
				},
			],
		]),
		duration: 69,
		predictionOutcomes: ["Tainted", "Not Tainted"],
		predictionTitle: "How filthy did my mods twist my words?",
		announmentColour: "primary",
	});
}

module.exports = copyAndUpdate;
