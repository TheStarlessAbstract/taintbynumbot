require("dotenv").config();
const express = require("express");
const http = require("http");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const botIo = require("./bot-io");
const chatClient = require("./bot-chatClient");
const pubSubClient = require("./bot-pubSubClient");

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.get("/channelpointoverlay", (req, res) => {
	res.sendFile(__dirname + "/public/bot-channelPointsOverlay.html");
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

	botIo.setup(io);
	await chatClient.setup();
	await pubSubClient.setup(io);
}
