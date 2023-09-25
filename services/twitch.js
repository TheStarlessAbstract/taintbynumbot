let pubSubApiClient;

async function getChannelInfoById(user) {
	const channel = await pubSubApiClient.channels.getChannelInfoById(user);

	return channel;
}

async function createPoll(broadcaster, data) {
	const poll = await pubSubApiClient.polls.createPoll(broadcaster, data);

	console.log(poll.endDate);
}

async function setApiClient(apiClient) {
	pubSubApiClient = apiClient;
}

exports.setApiClient = setApiClient;
exports.getChannelInfoById = getChannelInfoById;
exports.createPoll = createPoll;
