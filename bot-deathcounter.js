require("dotenv").config();

const axios = require("axios");

const DeathCounter = require("./models/deathcounter");

let twitchId = process.env.TWITCH_USER_ID;
let url = process.env.BOT_DOMAIN;

let gameName;
let streamDate;
let streamDeathCounter;
let gameDeathCounter;
let allDeathCounter;
let streamDeaths = 0;
let gameDeaths = 0;
let allDeaths = 0;

async function setup(newApiClient) {
	const apiClient = newApiClient;

	let stream = await apiClient.streams.getStreamByUserId(
		process.env.TWITCH_USER_ID
	);

	if (stream == null) {
		let channel = await apiClient.channels.getChannelInfoById(
			process.env.TWITCH_USER_ID
		);

		gameName = channel.gameName;

		streamDeathCounter = await DeathCounter.find({
			gameTitle: gameName,
		}).exec();

		if (streamDeathCounter.length > 0) {
			for (let i = 0; i < streamDeathCounter.length; i++) {
				gameDeaths = gameDeaths + streamDeathCounter[i].deaths;
			}
		}

		allDeathCounter = await DeathCounter.find({}).exec();

		if (allDeathCounter.length > 0) {
			for (let i = 0; i < allDeathCounter.length; i++) {
				allDeaths = allDeaths + allDeathCounter[i].deaths;
			}
		}
	} else {
		gameName = stream.gameName;
		streamDate = stream.startDate;
		streamDate = new Date(streamDate);
		streamDate = new Date(
			streamDate.getFullYear(),
			streamDate.getMonth(),
			streamDate.getDate()
		);

		streamDeathCounter = await DeathCounter.findOne({
			gameTitle: gameName,
			streamStartDate: streamDate,
		}).exec();

		gameDeathCounter = await DeathCounter.find({
			gameTitle: gameName,
		}).exec();

		allDeathCounter = await DeathCounter.find({}).exec();

		if (streamDeathCounter) {
			streamDeaths = streamDeathCounter.deaths;
		}

		if (gameDeathCounter.length > 0) {
			for (let i = 0; i < gameDeathCounter.length; i++) {
				gameDeaths = gameDeaths + gameDeathCounter[i].deaths;
			}
		}

		if (allDeathCounter.length > 0) {
			for (let i = 0; i < allDeathCounter.length; i++) {
				allDeaths = allDeaths + allDeathCounter[i].deaths;
			}
		}
	}

	let resp = await axios.post(url + "/deathcounter", {
		deaths: streamDeaths,
		gameDeaths: gameDeaths,
		allDeaths: allDeaths,
	});
}

exports.setup = setup;
