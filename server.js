require("dotenv").config();
const express = require("express");
const endpoints = require("./services/endpoints")
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const serverIo = require("./server-io");
const serverPubNub = require("./server-pubnub");

const uri = process.env.MONGO_URI;

if (uri != undefined)
{
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}
endpoints.setup(app,server);
serverIo.setup(io);
