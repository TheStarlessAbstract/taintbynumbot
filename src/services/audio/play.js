require("dotenv").config();
const botDomain = process.env.BOT_DOMAIN;

const axios = require("axios");

const play = async (channelId, url) => {
	// send to browser source
	let resp = await axios.post(botDomain + "/playaudio", {
		channelId,
		url,
	});
};

module.exports = play;
