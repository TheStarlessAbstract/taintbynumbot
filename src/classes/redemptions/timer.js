const Redemption = require("./redemption");

class Timer extends Redemption {
	constructor(
		channelId,
		channelName,
		name,
		{
			type,
			output,
			audio,
			duration,
			announcements,
			announcementColour,
			interval,
			messageInput,
		}
	) {
		super(channelId, channelName, name, {
			type,
			output,
			audio,
			announcementColour,
		});
		this.duration = duration;
		this.announcements = announcements;
		this.interval = interval;
		this.messageInput = messageInput;
	}

	getDuration() {
		return this.duration;
	}

	setDuration(duration) {
		this.duration = duration;
	}

	getInterval() {
		return this.interval;
	}

	setInterval(interval) {
		this.interval = interval;
	}

	getAnnouncement(key) {
		if (!this.announcements.has(key)) return undefined;
		const announcement = this.announcements.get(key);
		if (
			!announcement.active ||
			announcement.message === "" ||
			typeof announcement.message !== "string"
		)
			return undefined;

		return { color: this.announcementColour, message: announcement.message };
	}

	getUnitPlural(time, unit) {
		if (typeof time !== "number" || !unit) return "";
		if (time > 1) return `${time} ${unit}s`;
		else if (time === 1) return `${time} ${unit}`;
	}

	getTimeString(length) {
		let hours = 0;
		let minutes = 0;
		let seconds = 0;

		if (length >= 3600) hours = Math.floor(length / 3600);
		if (hours > 0) length = length % 3600;
		if (length >= 60) minutes = Math.floor(length / 60);
		if (minutes > 0) length = length % 60;
		seconds = length;

		hours = this.getUnitPlural(hours, "hour"); // "2 hours"
		minutes = this.getUnitPlural(minutes, "minute"); // 5 minutes
		seconds = this.getUnitPlural(seconds, "second"); // 10 seconds

		let timeString = seconds;
		if (minutes && timeString) timeString = `${minutes}, and ${timeString}`;
		else if (minutes) timeString = minutes;

		if (hours && minutes & seconds) timeString = `${hours}, ${timeString}`;
		else if (hours && (minutes || seconds))
			timeString = `${hours}, and ${timeString}`;
		else if (hours) timeString = hours;

		return timeString;
	}

	getMessageInput() {
		return this.messageInput;
	}

	setMessageInput(messageInput) {
		this.messageInput = messageInput;
	}

	checkMessageRequirement(message) {
		if (!this.messageInput?.active) return true;
		if (!message) return false;

		const messageWordCount = message.split(" ").length;

		if (
			this.minWordCount > messageWordCount ||
			this.maxWordCount < messageWordCount
		)
			return false;

		return true;
	}
}

module.exports = Timer;
