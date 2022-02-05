require("dotenv").config();
const https = require("https");
const http = require("http");

const redemptions = require("./bot-redemptions");
const commands = require("./bot-commands");

let url;
let min = 600000;
let max = 900000;
let interval;

if (process.env.PORT) {
	url = process.env.BOT_DOMAIN;
} else {
	url = "http://localhost:5000/";
}

function setup(io) {
	io.on("connection", (socket) => {
		console.log("a user connected");
		redemptions.audioImport();
		redemptions.setHydrateBooze();
		commands.commandsImport();

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
			clearInterval(interval);
		});

		socket.on("ended", (msg) => {
			redemptions.setCanPlay();
		});

		socket.on("not idle", (msg) => {
			// do nothing
		});
	});
}

function getRandomBetween() {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.setup = setup;
