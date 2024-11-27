const twitchRepo = require("../../../repos/twitch.js");

const getPredictions = async (broadcaster, pagination) => {
	const apiClient = twitchRepo.getApiClient();
	let predictions;

	try {
		predictions = await apiClient.predictions.getPredictions(
			broadcaster,
			pagination
		);
	} catch (err) {
		console.error(err);
	}

	return predictions;
};

module.exports = getPredictions;
