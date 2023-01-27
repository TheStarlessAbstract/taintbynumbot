require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const serverIo = require("./server-io");
const serverPubNub = require("./server-pubnub");

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

process.on("SIGTERM", handle);
process.on("SIGINT", handle);

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.get("/", (req, res) => {
	console.log("hello twitch");
	res.send("Hello Twitch!");
});

app.get("/channelpointoverlay", (req, res) => {
	res.sendFile(__dirname + "/public/bot-channelPointsOverlay.html");
});

app.get("/deathcounteroverlay", (req, res) => {
	res.sendFile(__dirname + "/public/bot-deathCounterOverlay.html");
});

app.get("/auth", (req, res) => {
	res.sendFile(__dirname + "/public/bot-auth.html");
});

app.get("/command", (req, res) => {
	let commandName = req.query.name;

	serverPubNub.publishMessage("command_toggle", commandName);
	res.sendStatus(200);
});

app.post("/playaudio", (req, res) => {
	serverIo.playAudio(req.body.url);
	res.sendStatus(201);
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

server.listen(port, () => {
	console.log("listening on *:" + port);
});

init();

async function init() {
	serverIo.setup(io);
}

async function handle(signal) {
	if (signal == "SIGTERM") {
		await serverIo.saveDeathState();
		process.exit(0);
	} else if (signal == "SIGINT") {
		await serverIo.saveDeathState();
		process.exit(0);
	}
}
