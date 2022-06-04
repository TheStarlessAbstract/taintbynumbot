require("dotenv").config();
const https = require("https");
const http = require("http");

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
let lastDeathType = "";
let deathCount;

if (process.env.PORT) {
	url = process.env.BOT_DOMAIN;
} else {
	url = "http://localhost:5000/";
}

function setup(newIo) {
	io = newIo;
	io.on("connection", (socket) => {
		console.log("a user connected");
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

		deathCounterInterval = setInterval(() => {
			deathCount = "";
			let deathTypes = ["Stream Deaths", "Game Deaths", "Avg Time To Death"];
			deathType = deathTypes[getRandomBetween(0, deathTypes.length - 1)];

			if (deathType != lastDeathType) {
				if (deathType == "Stream Deaths") {
					deathCount = deaths;
					lastDeathType = deathType;
				} else if (deathType == "Game Deaths" && gameDeaths > 0) {
					deathCount = gameDeaths;
					lastDeathType = deathType;
				} else if (
					deathType == "Avg Time To Death" &&
					average.hours + average.minutes + average.seconds > 0
				) {
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
				}

				io.emit("updateType", { deathType, deathCount });
			}
		}, getRandomBetween(300000, 600000));

		socket.on("disconnect", () => {
			console.log("user disconnected");
			isLive = false;
			clearInterval(interval);
			clearInterval(deathCounterInterval);
		});

		socket.on("ended", () => {
			lastPlayFinished = true;
		});

		socket.on("deathCounterConnection", () => {
			lastDeathType = "Stream Deaths";
			deaths = 0;
			gameDeaths = 0;
			average = { hours: 0, minutes: 0, seconds: 0 };
			setDeathCounter(lastDeathType);
		});
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

exports.setup = setup;
exports.playAudio = playAudio;
exports.setDeaths = setDeaths;
