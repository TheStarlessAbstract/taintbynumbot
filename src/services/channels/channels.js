const channelsController = require("../../controllers/channels");

function getChannel(id) {
	const channel = channelsController.getChannel(id);
	return channel;
}

function getChannelName(id) {
	const channel = channelsController.getChannel(id);
	return channel.name;
}

function getAllChannels() {
	const channels = channelsController.getAllChannels();
	return channels;
}

function addChannel(id, channel) {
	const channels = channelsController.getAllChannels();
	if (channels.has(id)) return false;
	const res = channelsController.addChannel(id, channel);
	return res;
}

function removeChannel(id) {
	const channels = channelsController.getAllChannels();
	if (channels.has(id)) return false;
	const res = channelsController.removeChannel(id);
	return res;
}

function getChannelMessageCount(id) {
	const channel = channelsController.getChannel(id);
	if (!channel) return false;
	return channel.getMessageCount();
}

function getAllChannelIds() {
	const channels = channelsController.getAllChannels();
	const ids = [...channels.keys()];

	return ids;
}

function getChannelRedemption(id, name) {
	const channel = getChannel(id);
	if (!channel) return undefined;
	return channel.getRedemption(name);
}

function getAllChannelRedemptions(id) {
	const channel = getChannel(id);
	if (!channel) return undefined;
	return channel.getAllRedemptions();
}

function addChannelRedemption(id, name, redemption) {
	const channel = getChannel(id);
	if (!channel) return undefined;
	channel.addRedemption(name, redemption);
	return true;
}

function removeChannelRedemption(id, name) {
	const channel = getChannel(id);
	if (!channel) return undefined;
	channel.deleteRedemption(name);
	return true;
}

function hasChannelCustomBot(id) {
	const channel = getChannel(id);
	if (!channel) return undefined;
	return channel.hasCustomBot();
}

function getChannelCustomBot(id) {
	const channel = getChannel(id);
	if (!channel) return undefined;
	return channel.getCustomBot();
}

module.exports = {
	getChannel,
	getChannelName,
	getChannelRedemption,
	getAllChannels,
	getAllChannelRedemptions,
	addChannel,
	addChannelRedemption,
	removeChannel,
	removeChannelRedemption,
	getChannelMessageCount,
	getAllChannelIds,
	hasChannelCustomBot,
	getChannelCustomBot,
};
