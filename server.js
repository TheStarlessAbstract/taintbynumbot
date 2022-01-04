require("dotenv").config();
const tmi = require("tmi.js");
const mongoose = require("mongoose");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const TINDERTIMEOUT = 30000;
let time;
let tinderTimer;
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
	upvote: {
		response: (argument) => `Successfully upvoted ${argument}`,
	},
	tinderquote: {
		response: async () => {
			time = new Date();
			let result = [];

			if (
				!tinderTimer ||
				(tinderTimer && time.getTime() >= tinderTimer + TINDERTIMEOUT)
			) {
				tinderTimer = time.getTime();

				let tinderEntries = await Tinder.find({});

				if (tinderEntries.length > 0) {
					let tinder = getRandom(tinderEntries);

					result.push(tinder.text);

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
		response: "addTinder",
	},
	titleharassment: {
		response: "titleHarassment",
	},
	addtitle: {
		response: "addTitle",
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
			let result = await response();
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
