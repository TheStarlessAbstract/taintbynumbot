const { play } = require("../services/audio");

async function timer(redeemDetails, variableMap) {
	const { message } = redeemDetails;
	// check if message is required, and has been provided
	if (!checkMessageRequirement(message)) return; // cancel redeem

	const duration = this.getDuration();
	let timeString = this.getTimeString(duration);
	variableMap.set("duration", timeString);

	let announcement = this.getAnnouncement("start");
	announcement.message = this.getProcessedOutput(
		announcement.message,
		variableMap
	);

	const customBot = this.getChannelCustomBot();
	const channelOrModId = customBot?.id || this.getChannelId();
	if (announcement) await this.sendAnnouncement(channelOrModId, announcement);

	if (this.audio.length > 0) this.playAudio(); // start audio

	const interval = this.getInterval();
	// timer interval message, remaining time
	if (interval.active) {
		let intervalCount = 0;
		const messageInterval = setInterval(async () => {
			intervalCount++;

			const output = this.getOutput("interval");
			if (!output) {
				clearInterval(messageInterval);
				return;
			}

			const remainingTime = duration - interval.duration * intervalCount;
			timeString = this.getTimeString(remainingTime);
			variableMap.set("remaining", timeString);
			message = this.getProcessedOutput(output.message, variableMap);
			this.say(message);

			if (remainingTime <= interval.duration) clearInterval(messageInterval);
		}, interval.duration * 1000);
	}

	await this.sleep(duration);
	announcement = this.getAnnouncement("end");
	announcement.message = this.getProcessedOutput(
		announcement.message,
		variableMap
	);

	if (announcement) await this.sendAnnouncement(channelOrModId, announcement);
	if (this.audio.length > 0) this.play(); // end audio
}

module.exports = timer;
