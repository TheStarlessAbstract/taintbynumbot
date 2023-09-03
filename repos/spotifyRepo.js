const axios = require("axios");
const querystring = require("querystring");

const User = require("../models/user");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

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

exports.getToken = getToken;
