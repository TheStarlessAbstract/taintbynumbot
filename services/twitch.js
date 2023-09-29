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

		const errorMessage = err.message;
		const messageStart =
			errorMessage.indexOf('message":"') + 'message":"'.length;
		const messageEnd = errorMessage.indexOf('"}', messageStart);
		const extractedMessage = errorMessage.substring(messageStart, messageEnd);

		console.error(
			`ERROR - status: ${err.statusCode}, url: ${err.url}, function: createPrediction(), message: ${extractedMessage}`
		);
	}

	return success;
}

async function setApiClient(apiClient) {
	pubSubApiClient = apiClient;
}

exports.setApiClient = setApiClient;
exports.getChannelInfoById = getChannelInfoById;
exports.createPoll = createPoll;
exports.createPrediction = createPrediction;
