const twitchRepo = require("../repos/twitch.js");

let apiClient;
let chatClient;

function init() {
	apiClient = twitchRepo.getApiClient();
	chatClient = twitchRepo.getChatClient();
}

async function getChannelInfoById(id) {
	let channel;

	try {
		channel = await apiClient.channels.getChannelInfoById(id);
	} catch (err) {
		console.error(err);
		channel = "";
	}

	return channel;
}

async function createPrediction(broadcaster, data) {
	let success = true;
	try {
		await apiClient.predictions.createPrediction(broadcaster, data);
	} catch (err) {
		success = false;
		console.error(err);
	}

	return success;
}

async function getPredictions(broadcaster, pagination) {
	let predictions;
	try {
		predictions = await apiClient.predictions.getPredictions(broadcaster);
	} catch (err) {
		console.error(err);
		predictions = null;
	}

	return predictions;
}

async function cancelPrediction(broadcaster, id) {
	try {
		await apiClient.predictions.cancelPrediction(broadcaster, id);
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
		await apiClient.channelPoints.updateRedemptionStatusByIds(
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
		await apiClient.chat.sendAnnouncement(broadcaster, announcement);
	} catch (err) {
		console.error(err);
	}
}

async function shoutoutUser(from, to) {
	let success = true;

	try {
		await apiClient.chat.shoutoutUser(from, to);
	} catch (err) {
		console.error(err);
		success = false;
	}

	return success;
}

async function getUserByName(username) {
	let user;

	try {
		user = await apiClient.users.getUserByName(username);
	} catch (err) {
		console.error(err);
		user = "";
	}

	return user;
}

async function getStreamByUserId(userId) {
	let stream;

	try {
		stream = await apiClient.streams.getStreamByUserId(userId);
	} catch (err) {
		console.error(err);
		stream = "";
	}

	return stream;
}

async function getStreamsByUserIds(users) {
	let streams;

	try {
		streams = await apiClient.streams.getStreamsByUserIds(users);
	} catch (err) {
		console.log("oof");
		console.error(err);
		streams = "";
	}

	return streams;
}

async function getChattersPaginated(broadcaster) {
	let chatters;

	try {
		chatters = await apiClient.chat.getChattersPaginated(broadcaster);
	} catch (err) {
		console.error(err);
		chatters = "";
	}

	return chatters;
}

async function getSubscriptionsForUsers(broadcaster, users) {
	let subscriptions;

	try {
		subscriptions = await apiClient.subscriptions.getSubscriptionsForUsers(
			broadcaster,
			users
		);
	} catch (err) {
		console.error(err);
		chatters = "";
	}

	return subscriptions;
}

async function getChannelFollowers(broadcaster, user, pagination) {
	let followers;

	try {
		followers = await apiClient.channels.getChannelFollowers(
			broadcaster,
			user,
			pagination
		);
	} catch (err) {
		console.error(err);
		chatters = "";
	}

	return followers;
}

async function getUserById(userId) {
	let user;

	try {
		user = await apiClient.users.getUserById(userId);
	} catch (err) {
		console.error(err);
		user = "";
	}

	return user;
}

exports.init = init;
exports.getUserById = getUserById;
exports.shoutoutUser = shoutoutUser;
exports.getUserByName = getUserByName;
exports.getPredictions = getPredictions;
exports.cancelPrediction = cancelPrediction;
exports.createPrediction = createPrediction;
exports.sendAnnouncement = sendAnnouncement;
exports.getStreamByUserId = getStreamByUserId;
exports.getChannelInfoById = getChannelInfoById;
exports.getChannelFollowers = getChannelFollowers;
exports.getStreamsByUserIds = getStreamsByUserIds;
exports.getChattersPaginated = getChattersPaginated;
exports.getSubscriptionsForUsers = getSubscriptionsForUsers;
exports.updateRedemptionStatusByIds = updateRedemptionStatusByIds;
