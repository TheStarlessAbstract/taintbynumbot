const axios = require("axios");

let audioTimeout = false;
let audioTimeoutActive = false;
let audioTimeoutPeriod = 10000;
let lastAudioPlayed;
let url = process.env.BOT_DOMAIN;

async function play(audioLink) {
	if (audioLink != "") {
		if (audioTimeout) {
			if (new Date().getTime() - lastAudioPlayed >= audioTimeoutPeriod) {
				audioTimeoutActive = false;
			} else {
				audioTimeoutActive = true;
			}
		} else {
			audioTimeoutActive = false;
		}

		if (!audioTimeoutActive) {
			lastAudioPlayed = new Date().getTime();
			let resp = await axios.post(url + "/playaudio", {
				url: audioLink,
				channelId: 100612361,
			});
		}
	}
}

function getAudioTimeout() {
	return audioTimeout;
}

function setAudioTimeout(newAudioTimeoutPeriod) {
	audioTimeoutPeriod = newAudioTimeoutPeriod * 1000 || 10000;
	if (audioTimeout) {
		audioTimeout = false;
	} else {
		audioTimeout = true;
	}
}

exports.getAudioTimeout = getAudioTimeout;
exports.setAudioTimeout = setAudioTimeout;
exports.play = play;
