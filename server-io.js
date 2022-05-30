require("dotenv").config();
const https = require("https");
const http = require("http");

let io;
let url;
let min = 600000;
let max = 900000;
let interval;
let lastPlayFinished = true;
let isLive = false;
let deaths = 0;
let gameDeaths = 0;
let allDeaths = 0;

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
		}, getRandomBetween());

		socket.on("disconnect", () => {
			console.log("user disconnected");
			isLive = false;
			clearInterval(interval);
		});

		socket.on("ended", () => {
			lastPlayFinished = true;
		});

		socket.on("deathCounterConnection", () => {
			setDeathCounter();
			deaths = 0;
			console.log("death");
		});
	});
}

function getRandomBetween() {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playAudio(url) {
	if (lastPlayFinished) {
		io.emit("playAudio", url);
		lastPlayFinished = false;
	}
}

function setDeaths(newDeaths, newGameDeaths, newAllDeaths) {
	deaths = newDeaths;
	gameDeaths = newGameDeaths;
	allDeaths = newAllDeaths;
	setDeathCounter();
}

function setDeathCounter() {
	io.emit("setDeath", { deaths, gameDeaths, allDeaths });
}

exports.setup = setup;
exports.playAudio = playAudio;
exports.setDeaths = setDeaths;
