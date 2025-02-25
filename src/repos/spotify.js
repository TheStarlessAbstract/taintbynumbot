const axios = require("axios");
const querystring = require("querystring");

const { findOne } = require("./../queries/users");
const token = require("../../models/token");

const botDomain = process.env.BOT_DOMAIN;
const redirectUri = botDomain + "/oauth/spotify";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getToken(channelId) {
	const user = await findOne(
		{
			channelId,
		},
		"tokens.spotify"
	);

	if (!user) return null;

	const currentTime = new Date();
	const expiresIn = user.tokens.get("spotify").expiresIn;

	if (expiresIn < currentTime) {
		// user = await setToken({ type: "refresh", user });
		user = await updateToken(user);
	}

	return user.tokens.get("spotify");
}

async function updateToken(tokenInput) {
	const channelId = "100612361";
	if (!tokenInput.user) {
		tokenInput.user = await findOne({
			channelId,
		});
		if (!tokenInput.user) return;
	}
	const formInput = generateFormInput(tokenInput);
	const tokenData = await requestToken(formInput);
	console.log(tokenData);
	// const token = tokenProcessing(tokenInput, tokenData);
	// user.tokens.set("spotify", token);
}

async function setToken(tokenInput) {
	console.log("nothing here");
	// 	const queryStringInput = generateFormInput(tokenInput);
	// 	// const response = await requestToken(queryStringInput);
	// 	// let user = await tokenProcessing(tokenInput, response.data);

	// 	if (tokenInput.type == "code") return "";
	// 	else if (tokenInput.type == "refresh") return user;
}

function generateFormInput(tokenInput) {
	let formInput;

	if (tokenInput.type == "code") {
		formInput = {
			grant_type: "authorization_code",
			code: tokenInput.code,
			redirect_uri: redirectUri,
		};
	} else if (tokenInput.type == "refresh") {
		let refreshToken = tokenInput.user.tokens.get("spotify").refreshToken;
		formInput = {
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			redirect_uri: redirectUri,
		};
	}

	return formInput;
}

async function requestToken(formInput) {
	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			querystring.stringify(formInput),
			{
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					Authorization:
						"Basic " +
						new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error(
			"Error getting access token:",
			error.response ? error.response.data : error.message
		);
		if (error.response) {
			// console.error("Status Code:", error.response.status);
			// console.error("Headers:", error.response.headers);
		}
		throw error; // Re-throw the error for handling elsewhere
	}
}

async function tokenProcessing(tokenInput, data) {
	let user;
	let expiresIn = Date.now() + data.expires_in * 1000;
	expiresIn = new Date(expiresIn);

	if (tokenInput.type == "code") {
		const channelId = process.env.TWITCH_USER_ID;
		user = await User.findOne({ channelId });

		if (user) {
			user.spotifyToken = {
				scope: data.scope,
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
				expiresIn: expiresIn,
			};
		} else {
			user = new User({
				twitchId: twitchUserId,
				joinDate: new Date(),
				spotifyToken: {
					accessToken: data.access_token,
					tokenType: data.token_type,
					scope: data.scope,
					expiresIn: expiresIn,
					refreshToken: data.refresh_token,
				},
			});
		}
	} else if (tokenInput.type == "refresh") {
		user = tokenInput.user;

		user.spotifyToken.scope = data.scope;
		user.spotifyToken.accessToken = data.access_token;
		user.spotifyToken.expiresIn = expiresIn;
	}

	await user.save();

	return user;
}

async function getUser(channelId) {
	const user = await findOne(
		{
			channelId,
		},
		"tokens.spotify"
	);

	return user;
}

exports.getToken = getToken;
exports.setToken = setToken;
exports.updateToken = updateToken;
