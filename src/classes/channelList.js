class ChannelList {
	constructor() {
		this.channels = new Map();
	}

	getChannel(id) {
		if (!this.channels.has(id)) return false;
		return this.channels.get(id);
	}

	updateChannel(id, channel) {
		if (!this.channels.has(id)) return false;
		this.channels.set(id, channel);
		return true;
	}

	addChannel(id, channel) {
		if (this.channels.has(id)) return false;
		this.channels.set(id, channel);
		return true;
	}

	removeChannel(id) {
		if (!this.channels.has(id)) return false;
		this.channels.delete(id);
	}
}

module.exports = ChannelList;
