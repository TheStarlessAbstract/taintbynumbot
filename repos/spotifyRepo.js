const axios = require("axios");
const querystring = require("querystring");

const User = require("../models/user");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const botDomain = process.env.BOT_DOMAIN;
const redirectUri = botDomain + "/oauth/spotify";

async function getToken(channelId) {
	let user = await User.findOne(
		{ twitchId: channelId, spotifyToken: { $exists: true } },
		"spotifyToken"
	).exec();

	if (!user) {
		return null;
	}

	let currentTime = new Date();
	let expiresIn = user.spotifyToken.expiresIn;

	if (expiresIn < currentTime) {
		user = await refreshToken(user);
	}

	return user.spotifyToken;
}

async function refreshToken(user) {
	let refreshToken = user.spotifyToken.refreshToken;

	const response = await axios.post(
		"https://accounts.spotify.com/api/token",
		querystring.stringify({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		}),
		{
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(clientId + ":" + clientSecret).toString("base64"),
			},
		}
	);

	let expiresIn = Date.now() + response.data.expires_in * 1000;
	expiresIn = new Date(expiresIn);

	user.spotifyToken.scope = response.data.scope;
	user.spotifyToken.accessToken = response.data.access_token;
	user.spotifyToken.expiresIn = expiresIn;

	await user.save();

	return user;
}

async function setToken(code) {
	const response = await axios.post(
		"https://accounts.spotify.com/api/token",
		querystring.stringify({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: redirectUri,
		}),
		{
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(clientId + ":" + clientSecret).toString("base64"),
			},
		}
	);

	let expiresIn = Date.now() + response.data.expires_in * 1000;
	expiresIn = new Date(expiresIn);

	let twitchUserId = process.env.TWITCH_USER_ID;
	let user = await User.findOne({ twitchId: twitchUserId });

	if (user) {
		user.spotifyToken = {
			scope: response.data.scope,
			accessToken: response.data.access_token,
			refreshToken: response.data.refresh_token,
			expiresIn: expiresIn,
		};
	} else {
		user = new User({
			twitchId: twitchUserId,
			joinDate: new Date(),
			spotifyToken: {
				accessToken: response.data.access_token,
				tokenType: response.data.token_type,
				scope: response.data.scope,
				expiresIn: expiresIn,
				refreshToken: response.data.refresh_token,
			},
		});
	}

	await user.save();
}

async function testToken(something) {
	// something = {
	// 	type: "code" || "refresh",
	// 	user: user,
	// 	code: code,
	// };

	let somethingElse;

	if (something.type == "code") {
		somethingElse = {
			grant_type: "code",
		};
	} else if (something.type == "refresh") {
		somethingElse = {
			grant_type: "refresh_token",
		};
	}

	const response = await axios.post(
		"https://accounts.spotify.com/api/token",
		querystring.stringify({
			somethingElse,
		}),
		{
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(clientId + ":" + clientSecret).toString("base64"),
			},
		}
	);
}

exports.getToken = getToken;
exports.setToken = setToken;
