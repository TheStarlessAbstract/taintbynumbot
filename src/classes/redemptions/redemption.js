const { say } = require("../../services/twitch/chatClient/");
const { play } = require("../../services/audio");
const { sleep } = require("../../utils");
const { sendAnnouncement } = require("../../services/twitch/asUser");

class Redemption {
	constructor(
		channelId,
		channelName,
		name,
		{ type, output, audio, announcementColour }
	) {
		this.channelId = channelId;
		this.channelName = channelName;
		this.name = name;
		this.type = type;
		this.action = {};
		this.output = output;
		this.audio = audio;
		this.announcementColour = announcementColour;
	}

	getChannelId() {
		return this.channelId;
	}

	getChannelName() {
		return this.channelName;
	}

	getName() {
		return this.name;
	}

	getType() {
		return this.type;
	}

	getOutput(key) {
		if (!this.output.has(key)) return undefined;
		const output = this.output.get(key);
		if (!output.active) return undefined;
		return output;
	}

	getAudio() {
		return this.audio;
	}

	getAction() {
		return this.action;
	}

	setName(name) {
		this.name = name;
	}

	setAction(action) {
		this.action = action.bind(this);
	}

	getProcessedOutput(output, variableMap) {
		if (!output) return undefined;
		const { processOutputString } = require("../../utils/modify");
		return processOutputString(output, variableMap);
	}

	getAllOutput() {
		return this.output;
	}

	async say(output) {
		await say(`#${this.channelName}`, output);
	}

	playAudio() {
		console.log(this.audio);
		play(this.channelId, this.audio);
	}

	setChannelName(name) {
		this.channelName = name;
	}

	hasOutput() {
		if (!this.output) return false;
		return true;
	}

	async sleep(duration) {
		await sleep(duration * 1000);
	}

	async sendAnnouncement(id, announcement) {
		return await sendAnnouncement(this.channelId, id, announcement);
	}

	getChannelCustomBot() {
		const { getChannelCustomBot } = require("../../services/channels/channels");
		return getChannelCustomBot(this.channelId);
	}
}

module.exports = Redemption;
