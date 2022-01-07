require("dotenv").config();
const tmi = require("tmi.js");
const mongoose = require("mongoose");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const Quote = require("./models/quote");
const TINDERCOOLDOWN = 30000;
const TITLECOOLDOWN = 30000;
const QUOTECOOLDOWN = 30000;
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

			if (isModUp && argument) {
				let quoteEntries = await Title.find({});

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

				await Title.create({
					index: quoteIndex,
					user: user,
					text: message,
					addedBy: context["display-name"],
				});
			} else if (!isModUp) {
				return ["!addTitle command is for Mods only"];
			} else if (!argument) {
				return [
					"To add a Title quote, you must include the quote after the command: '!addtitle Rose never doesn't get some abuse in through editing my titles @design_by_rose'",
				];
			}
		},
	},
	booty: {
		response: "Who loves the booty?",
	},
};

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
