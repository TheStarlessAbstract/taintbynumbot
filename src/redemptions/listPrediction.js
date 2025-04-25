const { play } = require("../services/audio");

async function listPrediction(redeemDetails, variableMap) {
	const { rewardId, id: redeemId } = redeemDetails;
	const redeemIds = [redeemId];
	const channelId = this.getChannelId();
	const predictions = await this.getPredictions();

	if (
		!predictions ||
		predictions.data[0].status == "ACTIVE" ||
		predictions.data[0].status == "LOCKED"
	) {
		this.updateRedemptionStatusByIds(rewardId, redeemIds, "CANCELED");

		output = this.getOutput("existing");
		if (!output) return;

		let message = this.getProcessedOutput(output.message, variableMap);
		this.say(message);
		return;
	}

	const prediction = await this.createPrediction();
	console.log(4);
	if (!prediction) {
		console.log(5);
		this.updateRedemptionStatusByIds(rewardId, redeemIds, "CANCELED");

		output = this.getOutput("errorCreatingPrediction");
		if (!output) return;

		let message = this.getProcessedOutput(output.message, variableMap);
		this.say(message);
		return;
	}
	console.log(6);
	let list = [];
	try {
		list = await this.aggregate([
			{
				$match: {
					channelId,
					name: this.listCategory,
				},
			},
			{ $sample: { size: 1 } },
		]);
	} catch (err) {
		console.log(7);
		console.error(err);
	}

	if (list.length === 0 || !list[0]?.text || typeof list[0].text !== "string") {
		console.log(8);
		this.updateRedemptionStatusByIds(rewardId, redeemIds, "CANCELED");
		this.cancelPrediction(prediction.id);

		output = this.getOutput("noListItemFound");
		if (!output) return;

		message = this.getProcessedOutput(output.message, variableMap);
		this.say(message);
		return;
	}
	console.log(9);
	output = this.getOutput("startedPrediction");
	if (output) {
		console.log(10);
		message = this.getProcessedOutput(output.message, variableMap);
		this.say(message);
	}
	console.log(11);
	await this.sleep(this.getDuration());
	const moderator = process.env.TWITCH_BOT_ID;
	await this.sendAnnouncement(moderator, { message: list[0].text });

	this.playAudio();
	console.log(12);
	this.updateRedemptionStatusByIds(rewardId, redeemIds, "FULFILLED");
}

module.exports = listPrediction;
