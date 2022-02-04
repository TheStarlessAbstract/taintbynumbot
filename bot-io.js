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
			socket.emit("refresh", "not idle");
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
