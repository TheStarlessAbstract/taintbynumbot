const channels = new Map();

function getChannel(id) {
	if (!channels.has(id)) return false;
	return channels.get(id);
}

function getAllChannels() {
	return channels;
}

function addChannel(id, channel) {
	if (channels.has(id)) return false;
	channels.set(id, channel);
	return true;
}

function removeChannel(id) {
	if (!channels.has(id)) return false;
	channels.delete(id);
	return true;
}

module.exports = {
	getChannel,
	getAllChannels,
	addChannel,
	removeChannel,
};
