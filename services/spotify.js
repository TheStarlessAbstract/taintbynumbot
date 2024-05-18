const axios = require("axios");
const querystring = require("querystring");

const spotifyRepo = require("../repos/spotify");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getCurrentPlaying(channelId) {
	const token = await spotifyRepo.getToken(channelId);

	if (token === null) {
		return "no token";
	}

	const response = await axios.get("https://api.spotify.com/v1/me/player/", {
		headers: {
			Authorization: "Bearer " + token.accessToken,
		},
	});

	let result = "";

	switch (response.statusCode) {
		case 401:
			result = `Can't access Spotify account, due to bad or expired token. Please re-authenticate`;
			break;
		case 403:
			result = `Can't access Spotify account, due to a bad OAuth request. Starless, fix it`;
			break;
		case 429:
			result = `Can't access Spotify account, as the application has exceeded rate limits, try again...much later`;
			break;
		default:
			//if other statusCode
			if (response?.statusCode) {
				result = `Can't access Spotify account, no idea really, error code is: ${response.statusCode}`;
			} else if (!response.data.is_playing) {
				result = "";
			} else if (response.data.is_playing) {
				result = `The song playing is: ${response.data.item.name} by ${response.data.item.artists[0].name}.
				Link: ${response.data.item.external_urls.spotify}`;
			}
	}

	if (response.statusCode) {
		return { playing: false, error: response.statusCode };
	}

	if (response.data.is_playing) {
		return {
			playing: true,
			title: response.data.item.name,
			artist: response.data.item.artists[0].name,
			url: response.data.item.external_urls.spotify,
		};
	} else {
		return { playing: false };
	}
}

async function requestToken(queryStringInput) {
	const response = await axios.post(
		"https://accounts.spotify.com/api/token",
		querystring.stringify(queryStringInput),
		{
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(clientId + ":" + clientSecret).toString("base64"),
			},
		}
	);

	return response;
}

exports.getCurrentPlaying = getCurrentPlaying;
exports.requestToken = requestToken;
