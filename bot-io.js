require("dotenv").config();
const https = require("https");

const redemptions = require("./bot-redemptions");

let min = 600000;
let max = 900000;
let interval;

function setup(io) {
	io.on("connection", (socket) => {
		console.log("a user connected");
		redemptions.audioImport();
		redemptions.setHydrateBooze();

		interval = setInterval(() => {
			try {
				https.get(process.env.BOT_DOMAIN, (res) => {
					// do nothing
				});
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
