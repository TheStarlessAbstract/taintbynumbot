require("dotenv").config();
const express = require("express");
const http = require("http");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const serverIo = require("./server-io");

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.use(express.json());

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

app.post("/playaudio", (req, res) => {
	serverIo.playAudio(req.body.url);
	res.sendStatus(201);
});

server.listen(port, () => {
	console.log("listening on *:" + port);
});

init();

async function init() {
	try {
		await fs.mkdir("./files", { recursive: false }, (err) => {
			if (err) throw err;
		});
	} catch (err) {}

	serverIo.setup(io);
}
