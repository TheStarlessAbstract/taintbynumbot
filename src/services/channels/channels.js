const channelsController = require("../../controllers/channels");

function getChannel(id) {
	const channel = channelsController.getChannel(id);
	return channel;
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

module.exports = {
	getChannel,
	getAllChannels,
	addChannel,
	removeChannel,
	getChannelMessageCount,
	getAllChannelIds,
};
