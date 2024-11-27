const twitchRepo = require("../../../repos/twitch.js");

const createPrediction = async (broadcaster, data) => {
	const apiClient = twitchRepo.getApiClient();
	let predictions;

	try {
		predictions = await apiClient.predictions.createPrediction(
			broadcaster,
			data
		);
	} catch (err) {
		console.error(err);
	}

	return predictions;
};

module.exports = createPrediction;
