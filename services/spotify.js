async function getCurrentPlaying(channelId) {
	let token = await getToken(channelId);

	if (token == null) {
		return "no token";
	}

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
