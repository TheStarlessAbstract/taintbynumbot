const axios = require("axios");

const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const AudioLink = require("../models/audiolink");
const DeathCounter = require("../models/deathcounter");

const audio = require("../bot-audio");
const chatClient = require("../bot-chatclient");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;
let url = process.env.BOT_DOMAIN;

let allTimeStreamDeaths;
let apiClient;
let audioLinks;
let cooldown = 5000;
let gamesPlayed;
let gameStreamDeaths;
let totalGameDeaths;
let totalStreamDeaths;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			try {
				let stream = await getStreamData();
				if (stream == null) {
					result.push(
						"Starless doesn't seem to be streaming right now, come back later"
					);
				} else {
					let currentTime = new Date();
					if (
						helper.isCooldownPassed(currentTime, f.timer, cooldown) ||
						helper.isStreamer(config)
					) {
						timer = currentTime;
						let gameName = stream.gameName;
						let streamDate = stream.startDate;
						let timeSinceStartAsMs = Math.floor(currentTime - streamDate);
						streamDate = new Date(
							streamDate.getFullYear(),
							streamDate.getMonth(),
							streamDate.getDate()
						);
						gameStreamDeaths = await getDeathCounter(
							gameName,
							streamDate,
							gameStreamDeaths
						);
						allTimeStreamDeaths++;
						totalGameDeaths++;
						totalStreamDeaths++;
						gameStreamDeaths.deaths++;
						await gameStreamDeaths.save();
						let averageToDeathMs = timeSinceStartAsMs / gameStreamDeaths.deaths;
						let averageToDeath = {
							hours: Math.floor(averageToDeathMs / (1000 * 60 * 60)),
							minutes: Math.floor((averageToDeathMs / (1000 * 60)) % 60),
							seconds: Math.floor((averageToDeathMs / 1000) % 60),
						};
						let audioLink;
						if (totalGameDeaths == 666) {
							audioLink = await AudioLink.findOne({ name: "666" });
							audioLink = audioLink?.url;
						} else {
							audioLink = helper.getRandomisedAudioFileUrl(audioLinks);
						}
						if (!helper.isTest()) {
							audio.play(audioLink);

							resp = await axios.post(url + "/deathcounter", {
								deaths: gameStreamDeaths.deaths,
								gameDeaths: totalGameDeaths,
								allDeaths: allTimeStreamDeaths,
								average: averageToDeath,
							});
						}
						let random = Math.floor(Math.random() * 100) + 1;
						let pularlity;
						if (random == 1) {
							pularlity = getPlurality(
								gameStreamDeaths.deaths,
								"death/fail",
								"deaths/fails"
							);
							result.push(
								"ThisIsFine ThisIsFine ThisIsFine it's only " +
									gameStreamDeaths.deaths +
									" " +
									pularlity +
									" ThisIsFine ThisIsFine ThisIsFine"
							);
						} else {
							pularlity = getPlurality(
								gameStreamDeaths.deaths,
								"time",
								"times"
							);
							result.push(
								"Starless has now died/failed " +
									gameStreamDeaths.deaths +
									" " +
									pularlity +
									" while playing " +
									gameStreamDeaths.gameTitle +
									" this stream"
							);
							if (random >= 13 && random <= 23) {
								pularlity = getPlurality(allTimeStreamDeaths, "time", "times");
								result.push(
									"Since records have started, Starless has died/failed a grand total of " +
										allTimeStreamDeaths +
										" " +
										pularlity
								);
							} else if (gamesPlayed > 1 && random >= 35 && random <= 45) {
								pularlity = getPlurality(totalStreamDeaths, "time", "times");
								result.push(
									"Starless has played " +
										gamesPlayed +
										" games this stream, and has died/failed about " +
										totalStreamDeaths +
										" " +
										pularlity
								);
							} else if (random >= 57 && random <= 67) {
								if (totalGameDeaths != 0) {
									pularlity = getPlurality(totalGameDeaths, "time", "times");
									result.push(
										"Starless has died/failed at least " +
											totalGameDeaths +
											" " +
											pularlity +
											", across all streams while playing " +
											gameStreamDeaths.gameTitle
									);
								}
							} else if (random >= 79 && random <= 89) {
								let averageString = "";
								pularlity = getPlurality(totalGameDeaths, "time", "times");
								if (averageToDeath.hours > 0) {
									averageString = averageToDeath.hours + "h ";
								}
								if (averageToDeath.minutes > 0) {
									averageString = averageString + averageToDeath.minutes + "m ";
								}
								if (averageToDeath.seconds > 0) {
									averageString = averageString + averageToDeath.seconds + "s ";
								}
								result.push(
									"Starless is dying/failing on average every " +
										averageString +
										"this stream. Don't go getting your hopes up this time"
								);
							}
						}
					}
				}
			} catch (err) {
				console.log(err);
				result.push(
					"Twitch says no, and Starless should really sort this out some time after stream"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description:
			"To keep track of my many, many, many, many, many deaths/failures",
		usage: "!f",
		usableBy: "users",
		active: true,
	},
];

const f = new TimerCommand(commandResponse, versions, cooldown);

const getDeathCounter = async (gameName, streamDate, gameStreamDeaths) => {
	let gameDeathCounter;

	if (
		gameStreamDeaths?.gameTitle === gameName &&
		gameStreamDeaths.streamStartDate === streamDate
	) {
		gameDeathCounter = gameStreamDeaths;
	} else {
		let deathCounter = await DeathCounter.findOne({
			gameTitle: gameName,
			streamStartDate: streamDate,
		});

		if (deathCounter) {
			gameDeathCounter = deathCounter;
		} else {
			gameDeathCounter = createDeathCounter(gameName, streamDate);
			gamesPlayed++;
		}
	}

	return gameDeathCounter;
};

function getPlurality(value, singular, plural) {
	let result;

	if (value > 1) {
		result = plural;
	} else {
		result = singular;
	}

	return result;
}

async function createDeathCounter(game, date) {
	return await DeathCounter.create({
		deaths: 0,
		gameTitle: game,
		streamStartDate: date,
	});
}

async function updateAudioLinks() {
	audioLinks = await AudioLink.find({ command: "f" }).exec();
}

async function getStreamData() {
	return await apiClient.streams.getStreamByUserId(twitchId);
}

async function setAllTimeStreamDeaths() {
	let deathCounters = await DeathCounter.find({}).exec();
	allTimeStreamDeaths = deathCounters.reduce(
		(total, counter) => total + counter.deaths,
		0
	);
}

async function setTotalStreamDeaths() {
	let date;
	let stream = await getStreamData();

	if (stream) {
		date = stream.startDate;
	}

	let deathCounters = await DeathCounter.find({
		streamStartDate: date,
	}).exec();

	gamesPlayed = deathCounters.length;

	totalStreamDeaths = deathCounters.reduce(
		(total, counter) => total + counter.deaths,
		0
	);
}

async function setTotalGameDeaths() {
	let game;
	let stream = await getStreamData();

	if (stream) {
		game = stream.gameName;
	}

	let deathCounters = await DeathCounter.find({ gameTitle: game });
	totalGameDeaths = deathCounters.reduce(
		(total, counter) => total + counter.deaths,
		0
	);
}

async function setup() {
	apiClient = await chatClient.getApiClient();

	await updateAudioLinks();
	await setAllTimeStreamDeaths();
	await setTotalStreamDeaths();
	await setTotalGameDeaths();
}

exports.command = f;
exports.setAllTimeStreamDeaths = setAllTimeStreamDeaths;
exports.setTotalGameDeaths = setTotalGameDeaths;
exports.setTotalStreamDeaths = setTotalStreamDeaths;
exports.setup = setup;
exports.updateAudioLinks = updateAudioLinks;
