const https = require("https");
const http = require("http");

const DeathSaveState = require("./models/deathsavestate");

let clientId = process.env.TWITCH_CLIENT_ID;

let io;
let url = process.env.BOT_DOMAIN;
let interval;
let deathCounterInterval;
let lastPlayFinished = true;
let isLive = false;
let deaths;
let gameDeaths;
let allDeaths = 0;
let average;
let lastDeathType = "Stream Deaths";
let deathCount;
let ssl = process.env.PORT ? https : http;

async function setup(newIo) {
	io = newIo;
	io.on("connection", async (socket) => {
		if (socket.handshake.headers.referer.includes("channelpointoverlay")) {
			console.log("/channelpointoverlay connected");
			isLive = true;

			interval = setInterval(() => {
				ssl.get(url, (res) => {});
			}, getRandomBetween(600000, 900000));

			socket.on("disconnect", () => {
				console.log("/channelpointoverlay disconnected");
				isLive = false;
				clearInterval(interval);
			});

			socket.on("ended", () => {
				lastPlayFinished = true;
			});
		}

		if (socket.handshake.headers.referer.includes("deathcounteroverlay")) {
			console.log("/deathcounteroverlay connected");

			let saveState = await DeathSaveState.findOne({}).exec();

			if (!saveState) {
				deaths = 0;
				gameDeaths = 0;
				average = { hours: 0, minutes: 0, seconds: 0 };
				setDeathCounter(lastDeathType);
			} else {
				deaths = saveState.deaths;
				gameDeaths = saveState.gameDeaths;
				average = saveState.average;
				await DeathSaveState.deleteOne({ _id: saveState._id });
			}

			deathCounterInterval = setInterval(() => {
				let deathTypes = ["Stream Deaths", "Game Deaths", "Avg Time To Death"];
				let emitFlag = false;
				deathCount = 0;
				deathType = deathTypes[getRandomBetween(0, deathTypes.length - 1)];

				if (deathType != lastDeathType) {
					if (deathType == "Stream Deaths") {
						deathCount = deaths;
						lastDeathType = deathType;
						emitFlag = true;
					} else if (deathType == "Game Deaths" && gameDeaths > 0) {
						deathCount = gameDeaths;
						lastDeathType = deathType;
						emitFlag = true;
					} else if (
						deathType == "Avg Time To Death" &&
						average.hours + average.minutes + average.seconds > 0
					) {
						deathCount = "";
						if (average.hours > 0) {
							deathCount = average.hours + "h ";
						}
						if (average.minutes > 0) {
							deathCount = deathCount + average.minutes + "m ";
						}
						if (average.seconds > 0) {
							deathCount = deathCount + average.seconds + "s";
						}
						lastDeathType = deathType;
						emitFlag = true;
					}

					if (emitFlag) {
						io.emit("updateType", { deathType, deathCount });
					}
				}
			}, getRandomBetween(300000, 600000));

			socket.on("disconnect", () => {
				console.log("/deathcounteroverlay disconnected");
				clearInterval(deathCounterInterval);
			});
		}

		if (socket.handshake.headers.referer.includes("auth")) {
			console.log("/auth connected");

			let redirectUri = "http://localhost:5000/test";
			let scope =
				"channel:manage:broadcast+channel:manage:predictions+channel:manage:redemptions+channel:read:predictions+" +
				"channel:read:redemptions+channel:read:subscriptions+channel_subscriptions";

			io.emit("setDetails", { clientId, redirectUri, scope });
		}
	});
}

function getRandomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playAudio(audioLink) {
	if (lastPlayFinished) {
		io.emit("playAudio", audioLink);
		lastPlayFinished = false;
	} else {
		console.log(3);
	}
}

function setDeaths(newDeaths, newGameDeaths, newAllDeaths, newAverage) {
	deaths = newDeaths;
	gameDeaths = newGameDeaths;
	allDeaths = newAllDeaths;
	average = newAverage;
	setDeathCounter(lastDeathType);
}

function setDeathCounter(currentDeathType) {
	let setDeathCount = "";

	if (currentDeathType == "Stream Deaths") {
		setDeathCount = deaths;
	} else if (currentDeathType == "Game Deaths") {
		setDeathCount = gameDeaths;
	} else if (currentDeathType == "Avg Time To Death") {
		if (average.hours > 0) {
			setDeathCount = average.hours + "h ";
		}
		if (average.minutes > 0) {
			setDeathCount = setDeathCount + average.minutes + "m ";
		}
		if (average.seconds > 0) {
			setDeathCount = setDeathCount + average.seconds + "s";
		}
	}

	io.emit("setDeath", setDeathCount);
}

async function saveDeathState() {
	let saveState = new DeathSaveState({
		deaths: deaths,
		gameDeaths: gameDeaths,
		allDeaths: allDeaths,
		average: average,
	});

	await saveState.save();
}

exports.setup = setup;
exports.playAudio = playAudio;
exports.setDeaths = setDeaths;
exports.saveDeathState = saveDeathState;
