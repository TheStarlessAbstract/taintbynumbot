const serverIo = require("../server-io");
const serverPubNub = require("../server-pubnub");

async function setup(app, server) {
	const port = process.env.PORT || 5000;
	const express = require("express"); // ask formal

	process.on("SIGTERM", handle);
	process.on("SIGINT", handle);
	app.use(express.json());
	app.use(express.static(__dirname + "/public"));

	app.get("/", (req, res) => {
		console.log("hello twitch");
		res.send("Hello Twitch!");
	});

	app.get("/auth", (req, res) => {
		res.sendFile(__dirname + "/public/bot-auth.html");
	});

	app.get("/channelpointoverlay", (req, res) => {
		res.sendFile(__dirname + "/public/bot-channelPointsOverlay.html");
	});

	app.get("/command", (req, res) => {
		let name = req.query.name;
		let number = req.query.version;
		let message = `{"command":  "${name}", "version": ${number}}`;

		serverPubNub.publishMessage("command_toggle", message);
		res.sendStatus(200);
	});

	app.get("/deathcounteroverlay", (req, res) => {
		res.sendFile(__dirname + "/public/bot-deathCounterOverlay.html");
	});

	app.post("/deathcounter", (req, res) => {
		let average;
		let deaths = req.body.deaths;
		let gameDeaths = req.body.gameDeaths;
		let allDeaths = req.body.allDeaths;

		if (!req.body.average) {
			average = { hours: 0, minutes: 0, seconds: 0 };
		} else {
			average = req.body.average;
		}

		serverIo.setDeaths(deaths, gameDeaths, allDeaths, average);
		res.sendStatus(201);
	});

	app.post("/playaudio", (req, res) => {
		serverIo.playAudio(req.body.url);
		res.sendStatus(201);
	});

	server.listen(port, () => {
		console.log("listening on *:" + port);
	});
}

async function handle(signal) {
	await serverIo.saveDeathState();
	process.exit(0);
}

exports.setup = setup;
