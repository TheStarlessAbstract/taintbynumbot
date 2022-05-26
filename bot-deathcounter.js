require("dotenv").config();

const axios = require("axios");

const DeathCounter = require("./models/deathcounter");

let twitchId = process.env.TWITCH_USER_ID;
let url = process.env.BOT_DOMAIN;

let gameDeathsCount = 0;

async function setup(newApiClient) {
	const apiClient = newApiClient;

	let channelInfo = await apiClient.channels.getChannelInfoById(
		process.env.TWITCH_USER_ID
	);

	let game = channelInfo.gameName;

	let gameDeaths = await DeathCounter.find({
		gameTitle: game,
	}).exec();

	if (gameDeaths.length > 0) {
		for (let i = 0; i < gameDeaths.length; i++) {
			gameDeathsCount = gameDeathsCount + gameDeaths[i].deaths;
		}
	}

	let resp = await axios.post(url + "/deathcounter", {
		deaths: gameDeathsCount,
	});
}

exports.setup = setup;
