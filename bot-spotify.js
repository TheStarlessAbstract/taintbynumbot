const axios = require("axios");
const querystring = require("querystring");

const User = require("./models/user");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getToken(channelId) {
	let user = await User.findOne({ twitchId: channelId }, "spotifyToken").exec();

	if (!user) {
		return null;
	}

	let currentTime = new Date();
	let expiresIn = user.spotifyToken.expires_in;

	if (expiresIn < currentTime) {
		user = await refreshToken(user);
	}

	return user.spotifyToken;
}

async function refreshToken(user) {
	let refreshToken = user.spotifyToken.refresh_token;

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
	user.spotifyToken.access_token = response.data.access_token;
	user.spotifyToken.expiresIn = expiresIn;

	await user.save();

	return user;
}

async function getCurrentPlaying(channelId) {
	let token = await getToken(channelId);

	if (token == null) {
		return "no token";
	}

	// spotify request
	const response = await axios.get(
		"https://api.spotify.com/v1/me/player/currently-playing",
		{
			headers: {
				Authorization: "Bearer " + token.access_token,
			},
		}
	);

	let result;

	if (response.statusCode == 401) {
		result = "poop";
	} else {
		result =
			"The song playing is: " +
			response.data.item.name +
			" by " +
			response.data.item.artists[0].name +
			".";
	}

	return result;
}

exports.getCurrentPlaying = getCurrentPlaying;
