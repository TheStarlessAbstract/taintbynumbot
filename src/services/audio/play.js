const axios = require("axios");

const play = async (channelId, url) => {
	// send to browser source
	let resp = await axios.post("http://localhost:5000" + "/playaudio", {
		channelId,
		url,
	});
};

module.exports = play;
