let pubSubApiClient;

async function getChannelInfoById(id) {
	let channel;

	try {
		channel = await pubSubApiClient.channels.getChannelInfoById(id);
	} catch (err) {
		console.error(err);
		channel = "";
	}

	return channel;
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
		await pubSubApiClient.chat.sendAnnouncement(broadcaster, announcement);
	} catch (err) {
		console.error(err);
	}
}

async function shoutoutUser(from, to) {
	let success = true;

	try {
		await pubSubApiClient.chat.shoutoutUser(from, to);
	} catch (err) {
		console.error(err);
		success = false;
	}

	return success;
}

async function getUserByName(username) {
	let user;

	try {
		user = await pubSubApiClient.users.getUserByName(username);
	} catch (err) {
		console.error(err);
		user = "";
	}

	return user;
}

async function setApiClient(apiClient) {
	pubSubApiClient = apiClient;
}

exports.setApiClient = setApiClient;
exports.shoutoutUser = shoutoutUser;
exports.getUserByName = getUserByName;
exports.getPredictions = getPredictions;
exports.cancelPrediction = cancelPrediction;
exports.createPrediction = createPrediction;
exports.sendAnnouncement = sendAnnouncement;
exports.getChannelInfoById = getChannelInfoById;
exports.updateRedemptionStatusByIds = updateRedemptionStatusByIds;
