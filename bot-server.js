require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const botIo = require("./bot-io");
const chatClient = require("./bot-chatClient");
const pubSubClient = require("./bot-pubSubClient");

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.get("/channelpointoverlay", (req, res) => {
	res.sendFile(__dirname + "/public/bot-channelPointsOverlay.html");
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});

init();

async function init() {
	botIo.setup(io);
	await chatClient.setup();
	await pubSubClient.setup(io);
}
