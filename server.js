require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const endpoints = require("./services/endpoints");
const serverIo = require("./server-io");

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(endpoints);

process.on("SIGTERM", handle);
process.on("SIGINT", handle);

if (uri != undefined) {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

serverIo.setup(io);

server.listen(port, () => {
	console.log("listening on *:" + port);
});

async function handle(signal) {
	await serverIo.saveDeathState();
	process.exit(0);
}
