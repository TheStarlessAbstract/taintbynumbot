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

exports.setup = setup;
exports.playAudio = playAudio;
