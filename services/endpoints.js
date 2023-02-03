const express = require("express");
const path = require("path");

const serverIo = require("../server-io");
const serverPubNub = require("../server-pubnub");

const router = express.Router();

router.get("/", (req, res) => {
	console.log("hello twitch");
	res.send("Hello Twitch!");
});

router.get("/auth", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "bot-auth.html"));
});

router.get("/channelpointoverlay", (req, res) => {
	res.sendFile(
		path.join(__dirname, "..", "public", "bot-channelPointsOverlay.html")
	);
});

router.get("/command", (req, res) => {
	let name = req.query.name;
	let number = req.query.version;
	let message = `{"command":  "${name}", "version": ${number}}`;

	serverPubNub.publishMessage("command_toggle", message);
	res.sendStatus(200);
});

router.post("/deathcounter", (req, res) => {
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

router.get("/deathcounteroverlay", (req, res) => {
	res.sendFile(
		path.join(__dirname, "..", "public", "bot-deathCounterOverlay.html")
	);
});

router.post("/playaudio", (req, res) => {
	serverIo.playAudio(req.body.url);
	res.sendStatus(201);
});

module.exports = router;
