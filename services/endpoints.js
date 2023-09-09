const axios = require("axios");
const express = require("express");
const path = require("path");
const querystring = require("querystring");

const Token = require("../models/token");
const User = require("../models/user");

const serverIo = require("../server-io");
const serverPubNub = require("../server-pubnub");
const spotifyRepo = require("../repos/spotifyRepo");

const router = express.Router();

router.get("/", (req, res) => {
	console.log("hello twitch");

	res.send("Hello Twitch!");
});

router.get("/test", async (req, res) => {
	console.log("hello twitch");

	const code = req.query.code;
	const scope = req.query.scope;

	let botDomain = process.env.BOT_DOMAIN;
	let clientId = process.env.TWITCH_CLIENT_ID;
	let clientSecret = process.env.TWITCH_CLIENT_SECRET;
	let redirectUri = botDomain + "/test";

	const response = await axios.post(
		"https://id.twitch.tv/oauth2/token",
		querystring.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "authorization_code",
			code: code,
			redirect_uri: redirectUri,
		}),
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	);

	// const accessToken = response.data;

	let token = await Token.findOne({ name: "pubSubClientTest" });

	if (token) {
		token.scope = response.data.scope;
		token.accessToken = response.data.access_token;
		token.refreshToken = response.data.refresh_token;
		token.expiresIn = 0;
		token.obtainmentTimestamp = 0;
	} else {
		token = new Token({
			name: "pubSubClientTest",
			scope: response.data.scope,
			accessToken: response.data.access_token,
			refreshToken: response.data.refresh_token,
			expiresIn: 0,
			obtainmentTimestamp: 0,
		});
	}

	token.save();

	// res.send("Hello code!");
	res.sendFile(path.join(__dirname, "..", "public", "bot-loggedIn.html"));
});

router.get("/auth", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "bot-auth.html"));
});

router.get("/spotify", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "bot-spotify-auth.html"));
});

// router.get("/oauth/spotify", async (req, res) => {
// 	const code = req.query.code;

// 	let botDomain = process.env.BOT_DOMAIN;
// 	const clientId = process.env.SPOTIFY_CLIENT_ID;
// 	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
// 	let redirectUri = botDomain + "/oauth/spotify";

// 	const response = await axios.post(
// 		"https://accounts.spotify.com/api/token",
// 		querystring.stringify({
// 			grant_type: "authorization_code",
// 			code: code,
// 			redirect_uri: redirectUri,
// 		}),
// 		{
// 			headers: {
// 				Authorization:
// 					"Basic " +
// 					Buffer.from(clientId + ":" + clientSecret).toString("base64"),
// 			},
// 		}
// 	);

// 	let expiresIn = Date.now() + response.data.expires_in * 1000;
// 	expiresIn = new Date(expiresIn);

// 	let twitchUserId = process.env.TWITCH_USER_ID;
// 	let user = await User.findOne({ twitchId: twitchUserId });

// 	if (user) {
// 		user.spotifyToken = {
// 			scope: response.data.scope,
// 			accessToken: response.data.access_token,
// 			refreshToken: response.data.refresh_token,
// 			expiresIn: expiresIn,
// 		};
// 	} else {
// 		user = new User({
// 			twitchId: twitchUserId,
// 			joinDate: new Date(),
// 			spotifyToken: {
// 				accessToken: response.data.access_token,
// 				tokenType: response.data.token_type,
// 				scope: response.data.scope,
// 				expiresIn: expiresIn,
// 				refreshToken: response.data.refresh_token,
// 			},
// 		});
// 	}

// 	user.save();

// 	res.sendFile(path.join(__dirname, "..", "public", "bot-loggedIn.html"));
// });

router.get("/oauth/spotify", async (req, res) => {
	const code = req.query.code;

	await spotifyRepo.setToken(code);

	res.sendFile(path.join(__dirname, "..", "public", "bot-loggedIn.html"));
});

router.get("/oauth/callback", (req, res) => {
	const code = req.query.code;

	// Use the code and scope to make a request for an access token
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
