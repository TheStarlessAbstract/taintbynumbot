const axios = require("axios");

const spotifyRepo = require("../repos/spotifyRepo");

async function getCurrentPlaying(channelId) {
	const token = await spotifyRepo.getToken(channelId);

	if (token === null) {
		return "no token";
	}

	// check if playing
	axios.get("https://api.spotify.com/v1/me/player/", {
		headers: {
			Authorization: "Bearer " + token.accessToken,
		},
	});

	const response = await axios.get(
		"https://api.spotify.com/v1/me/player/currently-playing",
		{
			headers: {
				Authorization: "Bearer " + token.accessToken,
			},
		}
	);

	let result;

	if (response.status === 200) {
		result = `The song playing is: ${response.data.item.name} by ${response.data.item.artists[0].name}. 
		Link: ${response.data.item.external_urls.spotify}`;
	} else if (response.statusCode == 401) {
		result = `Can't access Spotify account, due to bad or expired token. Please rea-authenticate`;
	} else if (response.statusCode == 403) {
		result = `Can't access Spotify account, due to a bad OAuth request. Starless, fix it`;
	} else if (response.statusCode == 429) {
		result = `Can't access Spotify account, as the application has exceeded rate limits, try again...much later`;
	} else {
		result = `Can't access Spotify account, no idea really, error code is: ${response.statusCode}`;
	}

	return result;
}

exports.getCurrentPlaying = getCurrentPlaying;
