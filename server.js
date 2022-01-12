require("dotenv").config();
const axios = require("axios");
const tmi = require("tmi.js");
const mongoose = require("mongoose");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const TwitchToken = require("./models/twitchtoken");
const Quote = require("./models/quote");
const TINDERCOOLDOWN = 30000;
const TITLECOOLDOWN = 30000;
const QUOTECOOLDOWN = 30000;
let twitch_access_token;
let time;
let tinderTimer;
let titleTimer;
let quoteTimer;
const uri =
	"mongodb+srv://" +
	process.env.USER +
	":" +
	process.env.PASS +
	"@cluster0.8pokz.mongodb.net/taint_bot?retryWrites=true&w=majority";

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const client = new tmi.Client({
	connection: {
		reconnect: true,
	},
	channels: ["thestarlessabstract"],
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN,
	},
});

client.connect();

init();

async function init() {
	twitch_access_token = await getTwitchAccessToken();

	if (twitch_access_token == null) {
		twitch_access_token = await createTwitchAccessToken();
		if (twitch_access_token == null) {
			client.say(
				channel,
				"TaintByNumBot is feeling a little scuffed, and Starless should probably sort this shit out at some point"
			);
		} else {
			await storeTwitchAccessToken(twitch_access_token);
		}
	}
}

const commands = {
	quote: {
		response: async (isModUp, context, argument) => {
			time = new Date();
			let result = [];
			let quoteEntries = [];
			let quote;
			let reject;

			if (
				!quoteTimer ||
				(quoteTimer && time.getTime() >= quoteTimer + QUOTECOOLDOWN)
			) {
				quoteTimer = time.getTime();

				if (!argument) {
					quoteEntries = await Quote.find({});
				} else {
					if (!isNaN(argument)) {
						quote = await Quote.findOne({ index: argument });
						if (!quote) {
						}
					} else {
						quoteEntries = await Quote.find({
							text: { $regex: argument, $options: "i" },
						});
					}
				}

				if (quoteEntries.length > 0) {
					quote = getRandom(quoteEntries);
				} else if (isNaN(argument)) {
					reject = "No Starless quote found mentioning: " + argument;
				} else if (!argument) {
					reject = "Starless has never said anything of note";
				}

				if (quote) {
					result.push(quote.index + `. ` + quote.text);
				} else {
					if (!isNaN(argument)) {
						reject = "There is no Starless quote number " + argument;
					}
					result.push(reject);
				}
			}
			return result;
		},
	},
	addquote: {
		response: async (isModUp, context, argument) => {
			let quoteIndex;

			if (isModUp && argument) {
				let quoteEntries = await Quote.find({});

				if (quoteEntries != 0) {
					quoteIndex = getNextIndex(quoteEntries);
				} else {
					quoteIndex = 1;
				}

				await Quote.create({
					index: quoteIndex,
					text: argument,
					addedBy: context["display-name"],
				});
			} else if (!isModUp) {
				return ["!addquote command is for Mods only"];
			} else if (!argument) {
				return [
					"To add a quote, you must include the quote after the command: '!addquote the mods totally never bully Starless'",
				];
			}
		},
	},
	tinderquote: {
		response: async (isModUp, context, argument) => {
			time = new Date();
			let result = [];
			let quoteEntries = [];
			let quote;
			let reject;

			if (
				!tinderTimer ||
				(tinderTimer && time.getTime() >= tinderTimer + TINDERCOOLDOWN)
			) {
				tinderTimer = time.getTime();

				if (!argument) {
					quoteEntries = await Tinder.find({});
				} else {
					if (!isNaN(argument)) {
						quote = await Tinder.findOne({ index: argument });
						if (!quote) {
						}
					} else {
						quoteEntries = await Tinder.find({
							text: { $regex: argument, $options: "i" },
						});
					}
				}

				if (quoteEntries.length > 0) {
					quote = getRandom(quoteEntries);
				} else if (isNaN(argument)) {
					reject = "No Tinder bio found mentioning: " + argument;
				} else if (!argument) {
					reject = "Nobody has ever created Tinder bio for Starless";
				}

				if (quote) {
					result.push(quote.index + `. ` + quote.text);
					if (quote.user != "") {
						result.push(
							`This Tinder bio was brought to you by the glorious, and taint-filled @${quote.user}`
						);
					}
				} else {
					if (!isNaN(argument)) {
						reject = "There is no Tinder bio number " + argument;
					}
					result.push(reject);
				}
			}

			return result;
		},
	},
	addtinder: {
		response: async (isModUp, context, argument) => {
			let message;
			let user;
			let quoteIndex;

			if (isModUp && argument) {
				let quoteEntries = await Tinder.find({});

				if (quoteEntries != 0) {
					quoteIndex = getNextIndex(quoteEntries);
				} else {
					quoteIndex = 1;
				}

				if (argument.includes("@")) {
					argument = argument.split("@");
					message = argument[0];
					user = argument[1];
				} else {
					message = argument;
					user = "";
				}

				await Tinder.create({
					index: quoteIndex,
					user: user,
					text: message,
					addedBy: context["display-name"],
				});
			} else if (!isModUp) {
				return ["!addTinder command is for Mods only"];
			} else if (!argument) {
				return [
					"To add a Tinder quote, you must include the quote after the command: '!addtinder Never mind about carpe diem, carpe taint @design_by_rose'",
				];
			}
		},
	},
	titleharassment: {
		response: async (isModUp, context, argument) => {
			time = new Date();
			let result = [];
			let quoteEntries = [];
			let quote;
			let reject;

			if (
				!titleTimer ||
				(titleTimer && time.getTime() >= titleTimer + TITLECOOLDOWN)
			) {
				titleTimer = time.getTime();

				if (!argument) {
					quoteEntries = await Title.find({});
				} else {
					if (!isNaN(argument)) {
						quote = await Title.findOne({ index: argument });
						if (!quote) {
						}
					} else {
						quoteEntries = await Title.find({
							text: { $regex: argument, $options: "i" },
						});
					}
				}

				if (quoteEntries.length > 0) {
					quote = getRandom(quoteEntries);
				} else if (isNaN(argument)) {
					reject = "No Title found mentioning: " + argument;
				} else if (!argument) {
					reject =
						"The mods don't seem to have been very abusive lately...with titles";
				}

				if (quote) {
					result.push(quote.index + `. ` + quote.text);
					if (quote.user != "") {
						result.push(
							`This possible streamer harassment was brought to you by the glorious, and taint-filled @${quote.user}`
						);
					}
				} else {
					if (!isNaN(argument)) {
						reject = "There is no Tinder bio number " + argument;
					}
					result.push(reject);
				}
			}

			return result;
		},
	},
	addtitle: {
		response: async (isModUp, context, argument) => {
			let message;
			let user;
			let quoteIndex;
			let result = [];
			let created;

			if (isModUp) {
				// gets all current titles
				let quoteEntries = await Title.find({});

				// sets index quote index
				if (quoteEntries != 0) {
					quoteIndex = getNextIndex(quoteEntries);
				} else {
					quoteIndex = 1;
				}

				// if no argument sent with !addTitle command
				if (!argument) {
					let config = {
						headers: {
							Authorization: "Bearer " + twitch_access_token,
							"Client-Id": process.env.TWITCH_CLIENT_ID,
						},
					};

					try {
						// gets channel details for broascaster_id
						let res = await axios.get(
							"https://api.twitch.tv/helix/channels?broadcaster_id=100612361",
							config
						);

						if (res.status == 200) {
							message = res.data.data[0].title;
						} else if (res.status == 500) {
							result.push(
								"Twitch is dropping the bomb, so try later or just paste the stream title after the command like so: !addtitle This would be a terrible title for a stream"
							);
						}
					} catch (err) {
						result.push(
							"Twitch says no, and Starless should really sort this out some time after stream"
						);
					}
				} else if (argument) {
					if (argument.includes("@")) {
						argument = argument.split("@");
						message = argument[0];
						user = argument[1];
					} else {
						message = argument;
					}
				}

				try {
					created = await Title.create({
						index: quoteIndex,
						text: message,
						user: user,
						addedBy: context["display-name"],
					});

					if (created._id) {
						result.push("Title added");
					}
				} catch (err) {
					if (err.code == 11000) {
						result.push("This title has already been added");
					} else {
						result.push(
							"There was some problem adding the title, and Starless should really sort this shit out."
						);
					}
				}
			} else if (!isModUp) {
				result.push("!addTitle command is for Mods only");
			}

			return result;
		},
	},
	booty: {
		response: "Who loves the booty?",
	},
};

client.on("connected", onConnectedHandler);
client.on("message", async (channel, context, message) => {
	const badges = context.badges || {};
	const isBroadcaster = badges.broadcaster;
	const isMod = badges.moderator;
	const isModUp = isBroadcaster || isMod;
	const isNotBot =
		context.username !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
	const isNotBuhhs = context.username !== "buhhsbot";

	if (!isNotBot || !isNotBuhhs) {
		return;
	} else {
		const [raw, command, argument] = message.match(regexpCommand) || [
			null,
			null,
			null,
		];
		if (!command) return;

		const { response } = (await commands[command.toLowerCase()]) || {};

		if (typeof response === "function") {
			let result = await response(isModUp, context, argument);
			if (result) {
				for (let i = 0; i < result.length; i++) {
					client.say(channel, result[i]);
				}
			}
		} else if (typeof response === "string") {
			client.say(channel, response);
		}
	}
});

function getRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

async function getTwitchAccessToken() {
	let token = await TwitchToken.find({});

	if (token.length > 0) {
		token = token[0];
	} else {
		token = null;
	}

	return token.accessToken;
}

async function createTwitchAccessToken() {
	let accessToken;
	let params = {
		client_id: process.env.TWITCH_CLIENT_ID,
		client_secret: process.env.TWITCH_CLIENT_SECRET,
		grant_type: "client_credentials",
	};

	let url = "https://id.twitch.tv/oauth2/token";
	try {
		let res = await axios.post(url, params);

		if (res.status == 200) {
			accessToken = res.data.access_token;
		}
	} catch (err) {
		accessToken = null;
	}
	return accessToken;
}

async function storeTwitchAccessToken(twitch_access_token) {
	let currentToken = await getTwitchAccessToken();
	if (currentToken == null) {
		await TwitchToken.create({
			accessToken: twitch_access_token,
		});
	} else {
		currentToken.accessToken = twitch_access_token;
		currentToken.save;
		// update current token
	}
}
