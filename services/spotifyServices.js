const axios = require("axios");

const spotifyRepo = require("../repos/spotifyRepo");

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

			break;
	}

	return result;
}

exports.getCurrentPlaying = getCurrentPlaying;
