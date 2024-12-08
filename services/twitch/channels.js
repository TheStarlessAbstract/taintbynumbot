let pubSubApiClient;

async function getChannelInfoById(user) {
	const channel = await pubSubApiClient.channels.getChannelInfoById(user);

	return channel;
}

async function setApiClient(apiClient) {
	pubSubApiClient = apiClient;
}

exports.setApiClient = setApiClient;
exports.getChannelInfoById = getChannelInfoById;
