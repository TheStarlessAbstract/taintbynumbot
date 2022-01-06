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

			if (
				!quoteTimer ||
				(quoteTimer && time.getTime() >= quoteTimer + QUOTECOOLDOWN)
			) {
				quoteTimer = time.getTime();

				let quoteEntries = await Quote.find({});

				if (quoteEntries.length > 0) {
					let quote = getRandom(quoteEntries);

					result.push(quote.index + `. ` + quote.text);
				} else {
					result.push(`Starless has never said anything of note`);
				}
			}

			return result;
		},
	},
	addquote: {
		response: async (isModUp, context, argument) => {
			let quoteIndex;

			if (isModUp) {
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
			}
		},
	},
	tinderquote: {
		response: async (isModUp, context, argument) => {
			time = new Date();
			let result = [];

			if (
				!tinderTimer ||
				(tinderTimer && time.getTime() >= tinderTimer + TINDERCOOLDOWN)
			) {
				tinderTimer = time.getTime();

				let tinderEntries = await Tinder.find({});

				if (tinderEntries.length > 0) {
					let tinder = getRandom(tinderEntries);

					result.push(tinder.index + `. ` + tinder.text);

					if (tinder.user != "") {
						result.push(
							`This Tinder bio was brought to you by the glorious, and taint-filled @${tinder.user}`
						);
					}
				} else {
					result.push(`Tinder bio? What Tinder bio?`);
				}
			}

			return result;
		},
	},
	addtinder: {
		response: async (isModUp, context, argument) => {
			let message;
			let user;
			let tinderIndex;

			if (isModUp) {
				let tinderEntries = await Tinder.find({});

				if (tinderEntries != 0) {
					tinderIndex = getNextIndex(tinderEntries);
				} else {
					tinderIndex = 1;
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
					index: tinderIndex,
					user: user,
					text: message,
					addedBy: context["display-name"],
				});
			}
		},
	},
	titleharassment: {
		response: async (isModUp, context, argument) => {
			time = new Date();
			let result = [];

			if (
				!titleTimer ||
				(titleTimer && time.getTime() >= titleTimer + TITLECOOLDOWN)
			) {
				titleTimer = time.getTime();

				let titleEntries = await Title.find({});

				if (titleEntries.length > 0) {
					let title = getRandom(titleEntries);

					result.push(title.index + `. ` + title.text);

					if (title.user != "") {
						result.push(
							`This possible streamer harrassment was brought to you by the glorious, and taint-filled @${title.user}`
						);
					}
				} else {
					result.push(`The mods don't seem to have been very abusive lately`);
				}
			}

			return result;
		},
	},
	addtitle: {
		response: async (isModUp, context, argument) => {
			let message;
			let user;
			let titleIndex;

			if (isModUp) {
				let titleEntries = await Title.find({});

				if (titleEntries != 0) {
					titleIndex = getNextIndex(titleEntries);
				} else {
					titleIndex = 1;
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
					index: titleIndex,
					user: user,
					text: message,
					addedBy: context["display-name"],
				});
			}
		},
	},
	booty: {
		response: "Who loves the booty?",
	},
};

console.log("hello, twitch");

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
