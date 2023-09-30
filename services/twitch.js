let pubSubApiClient;

async function getChannelInfoById(user) {
	const channel = await pubSubApiClient.channels.getChannelInfoById(user);

	return channel;
}

async function createPoll(broadcaster, data) {
	const poll = await pubSubApiClient.polls.createPoll(broadcaster, data);

	console.log(poll.endDate);
}

async function createPrediction(broadcaster, data) {
	let success = true;
	try {
		await pubSubApiClient.predictions.createPrediction(broadcaster, data);
	} catch (err) {
		success = false;

		console.error(err);
	}

	return success;
}

async function getPredictions(broadcaster, pagination) {
	let predictions;
	try {
		predictions = await pubSubApiClient.predictions.getPredictions(broadcaster);
	} catch (err) {
		console.error(err);

		predictions = null;
	}

	return predictions;
}

async function cancelPrediction(broadcaster, id) {
	try {
		await pubSubApiClient.predictions.cancelPrediction(broadcaster, id);
	} catch (err) {
		console.error(err);
	}
}

async function updateRedemptionStatusByIds(
	broadcaster,
	rewardId,
	redemptionIds,
	status
) {
	try {
		await pubSubApiClient.channelPoints.updateRedemptionStatusByIds(
			broadcaster,
			rewardId,
			redemptionIds,
			status
		);
	} catch (err) {
		console.error(err);
	}
}

async function sendAnnouncement(broadcaster, announcement) {
	try {
		console.log(announcement);
		await pubSubApiClient.chat.sendAnnouncement({
			broadcaster,
			announcement,
		});
	} catch (err) {
		console.error(err);
	}
}

async function setApiClient(apiClient) {
	pubSubApiClient = apiClient;
}

exports.setApiClient = setApiClient;
exports.getChannelInfoById = getChannelInfoById;
exports.createPoll = createPoll;
exports.createPrediction = createPrediction;
exports.getPredictions = getPredictions;
exports.updateRedemptionStatusByIds = updateRedemptionStatusByIds;
exports.cancelPrediction = cancelPrediction;
exports.sendAnnouncement = sendAnnouncement;
