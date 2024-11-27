const twitchRepo = require("../../../repos/twitch.js");

const cancelPrediction = async (broadcaster, id) => {
	const apiClient = twitchRepo.getApiClient();
	let predictions;

	try {
		predictions = await apiClient.predictions.cancelPrediction(broadcaster, id);
	} catch (err) {
		console.error(err);
	}

	return predictions;
};

module.exports = cancelPrediction;
