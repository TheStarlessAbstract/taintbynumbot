require("dotenv").config();
const https = require("https");
const http = require("http");

const DeathSaveState = require("./models/deathsavestate");

let io;
let url;
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

if (process.env.PORT) {
	url = process.env.BOT_DOMAIN;
} else {
	url = "http://localhost:5000/";
}

async function setup(newIo) {
	io = newIo;
	io.on("connection", async (socket) => {
		if (socket.handshake.headers.referer.includes("channelpointoverlay")) {
			console.log("/channelpointoverlay connected");

			isLive = true;

			interval = setInterval(() => {
				try {
					if (process.env.PORT) {
						https.get(url, (res) => {
							// do nothing
						});
					} else {
						http.get(url, (res) => {
							// do nothing
						});
					}
				} catch (err) {
					console.log(err);
				}
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

			let saveState = await DeathSaveState.find({}).exec();

			if (saveState.length == 0) {
				deaths = 0;
				gameDeaths = 0;
				average = { hours: 0, minutes: 0, seconds: 0 };
				setDeathCounter(lastDeathType);
			} else {
				deaths = saveState[0].deaths;
				gameDeaths = saveState[0].gameDeaths;
				average = saveState[0].average;
				await DeathSaveState.deleteOne({ _id: saveState[0]._id });
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
	});
}

function getRandomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playAudio(url) {
	if (lastPlayFinished) {
		io.emit("playAudio", url);
		lastPlayFinished = false;
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
