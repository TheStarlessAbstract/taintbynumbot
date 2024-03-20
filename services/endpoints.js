const axios = require("axios");
const express = require("express");
const path = require("path");
const querystring = require("querystring");

const Token = require("../models/token");
const User = require("../models/user");

const serverIo = require("../server-io");
const serverPubNub = require("../server-pubnub");
const spotifyRepo = require("../repos/spotify");

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello Twitch!");
});

router.get("/test", async (req, res) => {
	const code = req.query.code;

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

	let users = await axios.get("https://api.twitch.tv/helix/users", {
		headers: {
			Authorization: `Bearer ${response.data.access_token}`,
			"Client-ID": clientId,
		},
	});

	let twitchId = users.data.data[0].id;
	let user = await User.findOne({
		twitchId: twitchId,
	});

	if (user) {
		user.twitchToken = {
			scope: response.data.scope,
			accessToken: response.data.access_token,
			refreshToken: response.data.refresh_token,
			expiresIn: response.data.expires_in,
			obtainmentTimestamp: 0,
		};
	} else {
		let role = "user";
		if (twitchId == process.env.TWITCH_USER_ID) {
			role = "admin";
		} else if (twitchId == process.env.TWITCH_BOT_ID) {
			role = "bot";
		}

		user = new User({
			twitchId: twitchId,
			joinDate: new Date(),
			role: role,
			twitchToken: {
				scope: response.data.scope,
				accessToken: response.data.access_token,
				refreshToken: response.data.refresh_token,
				expiresIn: response.data.expires_in,
				obtainmentTimestamp: 0,
			},
		});
	}

	user.save();

	res.sendFile(path.join(__dirname, "..", "public", "bot-loggedIn.html"));
});

router.get("/auth", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "bot-auth.html"));
});

router.get("/botAuthorisation", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "bot-auth-bothlogin.html"));
});

router.get("/spotify", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "bot-spotify-auth.html"));
});

router.get("/oauth/spotify", async (req, res) => {
	const code = req.query.code;

	// returns empty string
	await spotifyRepo.setToken({ type: "code", code: code });

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
