const axios = require("axios");
const querystring = require("querystring");

const { findOne } = require("./../queries/users");

const botDomain = process.env.BOT_DOMAIN;
const redirectUri = botDomain + "/oauth/spotify";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getToken(channelId) {
	let user = await findOne(
		{
			channelId,
		},
		"tokens.spotify"
	);

	if (!user) return null;

	const currentTime = Date.now();
	const expiresIn = user.tokens.get("spotify").expiresIn;

	if (expiresIn < currentTime)
		user = await updateToken({ type: "refresh", user });

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
	const querystringInput = generateQuerystringInput(tokenInput);
	const tokenData = await requestToken(querystringInput);

	return await tokenProcessing(tokenInput, tokenData);
}

async function setToken(tokenInput) {
	console.log("nothing here");
	// 	const queryStringInput = generateFormInput(tokenInput);
	// 	// const response = await requestToken(queryStringInput);
	// 	// let user = await tokenProcessing(tokenInput, response.data);

	// 	if (tokenInput.type == "code") return "";
	// 	else if (tokenInput.type == "refresh") return user;
}

function generateQuerystringInput(tokenInput) {
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

async function requestToken(querystringInput) {
	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			querystring.stringify(querystringInput),
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
		}
		throw error; // Re-throw the error for handling elsewhere
	}
}

async function tokenProcessing(tokenInput, data) {
	const user = tokenInput.user;
	let token;
	let expiresIn = Date.now() + data.expires_in * 1000;

	if (tokenInput.type == "code") {
		token = {
			tokenType: "spotify",
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			scope: data.scope,
			expiresIn: expiresIn,
			obtainmentTimestamp: 0,
		};

		user.tokens.set("spotify", token);
	} else if (tokenInput.type == "refresh") {
		token = user.tokens.get("spotify");
		token.accessToken = data.access_token;
		token.scope = data.scope;
		token.expiresIn = expiresIn;
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
