const spotifyServices = require("../services/spotifyServices");

const User = require("../models/user");

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
		user = await setToken({ type: "refresh", user: user });
	}

	return user.spotifyToken;
}

async function setToken(tokenInput) {
	let queryStringInput = generateQueryStringInput(tokenInput);

	const response = await spotifyServices.requestToken(queryStringInput);

	let user = await tokenProcessing(tokenInput, response.data);

	if (tokenInput.type == "code") {
		return "";
	} else if (tokenInput.type == "refresh") {
		return user;
	}
}

function generateQueryStringInput(tokenInput) {
	let queryStringInput;

	if (tokenInput.type == "code") {
		queryStringInput = {
			grant_type: "authorization_code",
			code: tokenInput.code,
			redirect_uri: redirectUri,
		};
	} else if (tokenInput.type == "refresh") {
		let refreshToken = tokenInput.user.spotifyToken.refreshToken;
		queryStringInput = {
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		};
	}

	return queryStringInput;
}

async function tokenProcessing(tokenInput, data) {
	let user;
	let expiresIn = Date.now() + data.expires_in * 1000;
	expiresIn = new Date(expiresIn);

	if (tokenInput.type == "code") {
		let twitchUserId = process.env.TWITCH_USER_ID;
		user = await User.findOne({ twitchId: twitchUserId });

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

exports.getToken = getToken;
exports.setToken = setToken;
