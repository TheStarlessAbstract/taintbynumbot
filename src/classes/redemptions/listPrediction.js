const Redemption = require("./redemption");
const { aggregate } = require("../../queries/list");
const {
	updateRedemptionStatusByIds,
} = require("../../services/twitch/channelPoints");
const {
	getPredictions,
	createPrediction,
	cancelPrediction,
} = require("../../services/twitch/predictions");

class ListPrediction extends Redemption {
	constructor(
		channelId,
		channelName,
		name,
		{
			type,
			output,
			audio,
			duration,
			predictionOutcomes,
			predictionTitle,
			announcementColour,
			listCategory,
		}
	) {
		super(channelId, channelName, name, {
			type,
			output,
			audio,
			announcementColour,
		});

		this.duration = duration;
		this.predictionOutcomes = predictionOutcomes;
		this.predictionTitle = predictionTitle;
		this.listCategory = listCategory;
	}
	async aggregate(pipeline) {
		return await aggregate(pipeline);
	}

	updateRedemptionStatusByIds(rewardId, redemptionIds, status) {
		return updateRedemptionStatusByIds(
			this.channelId,
			rewardId,
			redemptionIds,
			status
		);
	}

	getPredictions() {
		return getPredictions(this.channelId);
	}

	createPrediction() {
		const data = {
			autoLockAfter: this.duration,
			outcomes: this.predictionOutcomes,
			title: this.predictionTitle,
		};

		return createPrediction(this.channelId, data);
	}

	cancelPrediction(id) {
		return cancelPrediction(this.channelId, id);
	}

	getListCategory() {
		return this.listCategory;
	}

	getDuration() {
		return this.duration;
	}

	setDuration(seconds) {
		this.duration = seconds;
	}
}

module.exports = ListPrediction;
