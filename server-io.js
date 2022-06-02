require("dotenv").config();
const https = require("https");
const http = require("http");

let io;
let url;
let interval;
let deathCounterInterval;
let lastPlayFinished = true;
let isLive = false;
let deaths = 0;
let gameDeaths = 0;
let allDeaths = 0;
let average = { hours: 0, minutes: 0, seconds: 0 };
let lastDeathType = "";
let deathCount = 0;

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
			let deathTypes = ["Stream Deaths", "Game Deaths", "Time To Death"];
			deathType = deathTypes[getRandomBetween(0, deathTypes.length - 1)];

			if (deathType != lastDeathType) {
				lastDeathType = deathType;

				if (deathType == "Stream Deaths") {
					deathCount = deaths;
				} else if (deathType == "Game Deaths") {
					deathCount = gameDeaths;
				} else if (deathType == "Time To Death") {
					deathCount =
						average.hours +
						"h " +
						average.minutes +
						"m " +
						average.seconds +
						"s";
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
			deaths = 0;
			setDeathCounter();
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
	setDeathCounter();
}

function setDeathCounter() {
	io.emit("setDeath", { deaths, gameDeaths, allDeaths });
}

exports.setup = setup;
exports.playAudio = playAudio;
exports.setDeaths = setDeaths;
