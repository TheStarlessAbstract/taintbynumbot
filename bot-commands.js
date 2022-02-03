const ApiClient = require("@twurple/api").ApiClient;

const DeathCounter = require("./models/deathcounter");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const Quote = require("./models/quote");

const TINDERCOOLDOWN = 30000;
const TITLECOOLDOWN = 30000;
const QUOTECOOLDOWN = 30000;

let allTimeStreamDeaths = 0;
let apiClient;
let gameStreamDeaths;
let time;
let tinderTimer;
let titleTimer;
let totalStreamDeaths = 0;
let quoteTimer;

const commands = {
	addtinder: {
		response: async (config) => {
			let message;
			let user;
			let quoteIndex;
			let result = [];

			if (config.isModUp && config.argument) {
				let quoteEntries = await Tinder.find({});

				if (quoteEntries != 0) {
					quoteIndex = getNextIndex(quoteEntries);
				} else {
					quoteIndex = 1;
				}

				if (config.argument.includes("@")) {
					config.argument = config.argument.split("@");
					message = config.argument[0];
					user = config.argument[1];
				} else {
					message = config.argument;
					user = "";
				}

				await Tinder.create({
					index: quoteIndex,
					user: user,
					text: message,
					addedBy: config.userInfo.displayName,
				});
				result.push(["Added new Tinder bio"]);

				if (user == "") {
					result.push([
						"To add the name of the author of this Tinder bio !edittinderauthor " +
							quoteIndex +
							" @USERNAME",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!addTinder command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a Tinder quote, you must include the quote after the command: '!addtinder Never mind about carpe diem, carpe taint @design_by_rose'",
				]);
			}

			return result;
		},
	},
	addtitle: {
		response: async (config) => {
			let message;
			let user;
			let quoteIndex;
			let result = [];
			let created;

			if (config.isModUp) {
				let quoteEntries = await Title.find({});

				if (quoteEntries != 0) {
					quoteIndex = getNextIndex(quoteEntries);
				} else {
					quoteIndex = 1;
				}

				if (!config.argument) {
					try {
						let channel = await apiClient.channels.getChannelInfo(
							process.env.TWITCH_USER_ID
						);

						if (channel == null) {
							result.push(
								"Twitch says no, and Starless should really sort this out some time after stream"
							);
						} else {
							message = channel.title;
						}
					} catch (err) {
						result.push(
							"Twitch says no, and Starless should really sort this out some time after stream"
						);
					}
				} else if (config.argument) {
					if (config.argument.includes("@")) {
						config.argument = config.argument.split("@");
						message = config.argument[0];
						user = config.argument[1];
					} else {
						message = config.argument;
					}
				}
				if (result.length == 0) {
					try {
						created = await Title.create({
							index: quoteIndex,
							text: message,
							user: user,
							addedBy: config.userInfo.displayName,
						});

						if (created._id) {
							result.push("Title added");
						}
					} catch (err) {
						if (err.code == 11000) {
							result.push("This title has already been added");
						} else {
							console.log(err);
							result.push(
								"There was some problem adding the title, and Starless should really sort this shit out."
							);
						}
					}
				}
			} else if (!config.isModUp) {
				result.push("!addTitle command is for Mods only");
			}

			return result;
		},
	},
	addquote: {
		response: async (config) => {
			let quoteIndex;

			if (config.isModUp && config.argument) {
				let quoteEntries = await Quote.find({});

				if (quoteEntries != 0) {
					quoteIndex = getNextIndex(quoteEntries);
				} else {
					quoteIndex = 1;
				}

				await Quote.create({
					index: quoteIndex,
					text: config.argument,
					addedBy: config.userInfo.displayName,
				});
				return ["Quote added"];
			} else if (!config.isModUp) {
				return ["!addquote command is for Mods only"];
			} else if (!config.argument) {
				return [
					"To add a quote, you must include the quote after the command: '!addquote the mods totally never bully Starless'",
				];
			}
		},
	},
	booty: {
		response: "Who loves the booty?",
	},
	edittinderauthor: {
		response: async (config) => {
			let user;
			let quoteIndex;
			let result = [];

			if (config.isModUp && config.argument) {
				config.argument = config.argument.split(" ");
				quoteIndex = config.argument[0];
				user = config.argument[1];

				if (isNaN(quoteIndex) || !user.startsWith("@")) {
					result.push([
						"To user this command, !edittinderauthor 1 @thestarlessabstract",
					]);
				} else {
					user = user.substring(1);
					let quote = await Tinder.findOne({ index: quoteIndex });

					if (quote) {
						quote.user = user;
						quote.save();
						result.push(["Tinder bio updated"]);
					} else {
						result.push(["No Tinder bio found for that number"]);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!edittinderauthor command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To use this command, !edittinderauthor 1 @thestarlessabstract",
				]);
			}
			return result;
		},
	},
	f: {
		response: async ({}) => {
			let result = [];
			let gameName;
			let streamDate;
			let deathCounters;
			let randomCheck;

			try {
				let stream = await apiClient.streams.getStreamByUserId(
					process.env.TWITCH_USER_ID
				);

				if (stream == null) {
					result.push(
						"Starless doesn't seem to be streaming right now, come back later"
					);
				} else {
					gameName = stream.gameName;
					streamDate = stream.startDate;
					streamDate = new Date(streamDate);
					streamDate = new Date(
						streamDate.getFullYear(),
						streamDate.getMonth(),
						streamDate.getDate()
					);

					if (!gameStreamDeaths) {
						deathCounters = await DeathCounter.find({
							streamStartDate: streamDate,
						}).exec();

						if (deathCounters.length == 0) {
							gameStreamDeaths = await createDeathCounter(gameName, streamDate);
						} else {
							if (deathCounters.length > 1) {
								randomCheck = deathCounters.length;
							}
							for (let i = 0; i < deathCounters.length; i++) {
								totalStreamDeaths = totalStreamDeaths + deathCounters[i].deaths;
							}

							deathCounters = await DeathCounter.findOne({
								gameTitle: gameName,
								streamStartDate: streamDate,
							}).exec();

							if (deathCounters) {
								gameStreamDeaths = deathCounters;
							} else {
								gameStreamDeaths = await createDeathCounter(
									gameName,
									streamDate
								);
							}
						}
					} else {
						if (gameStreamDeaths.gameTitle != gameName) {
							deathCounters = await DeathCounter.findOne({
								gameTitle: gameName,
								streamStartDate: streamDate,
							}).exec();

							if (deathCounters) {
								gameStreamDeaths = deathCounters;
							} else {
								gameStreamDeaths = await createDeathCounter(
									gameName,
									streamDate
								);
							}
						}
					}
					gameStreamDeaths.deaths++;
					totalStreamDeaths++;
					allTimeStreamDeaths++;
					gameStreamDeaths.save();

					result.push(
						"Starless has now died " +
							gameStreamDeaths.deaths +
							" times while playing " +
							gameStreamDeaths.gameTitle +
							" this stream"
					);

					let random = Math.floor(Math.random() * 101);

					if (random >= 14 && random <= 27) {
						result.push(
							"Since records have started, Starless has died a grand total of " +
								allTimeStreamDeaths +
								" times"
						);
					} else if (randomCheck && random >= 42 && random <= 55) {
						result.push(
							"Starless has played " +
								randomCheck +
								" games this stream, and has died about " +
								totalStreamDeaths +
								" times"
						);
					} else if (random >= 70 && random <= 83) {
						let gameDeaths = 0;
						let gameStreams = await DeathCounter.find({
							gameTitle: gameName,
						}).exec();
						if (gameStreams.length > 1) {
							for (let i = 0; i < gameStreams.length; i++) {
								gameDeaths = gameDeaths + gameStreams.deaths;
							}

							result.push(
								"Starless has died at least " +
									gameDeaths +
									" times, across all streams while playing " +
									gameStreams[0].gameTitle
							);
						}
					}
				}
			} catch (err) {
				result.push(
					"Twitch says no, and Starless should really sort this out some time after stream"
				);
			}

			return result;
		},
	},
	tinderquote: {
		response: async (config) => {
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

				if (!config.argument) {
					quoteEntries = await Tinder.find({});
				} else {
					if (!isNaN(config.argument)) {
						quote = await Tinder.findOne({ index: config.argument });
						if (!quote) {
						}
					} else {
						quoteEntries = await Tinder.find({
							text: { $regex: config.argument, $options: "i" },
						});
					}
				}

				if (quoteEntries.length > 0) {
					quote = getRandom(quoteEntries);
				} else if (isNaN(config.argument)) {
					reject = "No Tinder bio found mentioning: " + config.argument;
				} else if (!config.argument) {
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
					if (!isNaN(config.argument)) {
						reject = "There is no Tinder bio number " + config.argument;
					}
					result.push(reject);
				}
			}

			return result;
		},
	},
	titleharassment: {
		response: async (config) => {
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

				if (!config.argument) {
					quoteEntries = await Title.find({});
				} else {
					if (!isNaN(config.argument)) {
						quote = await Title.findOne({ index: config.argument });
						if (!quote) {
						}
					} else {
						quoteEntries = await Title.find({
							text: { $regex: config.argument, $options: "i" },
						});
					}
				}

				if (quoteEntries.length > 0) {
					quote = getRandom(quoteEntries);
				} else if (isNaN(config.argument)) {
					reject = "No Title found mentioning: " + config.argument;
				} else if (!config.argument) {
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
					if (!isNaN(config.argument)) {
						reject = "There is no Tinder bio number " + config.argument;
					}
					result.push(reject);
				}
			}

			return result;
		},
	},
	quote: {
		response: async (config) => {
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

				if (!config.argument) {
					quoteEntries = await Quote.find({});
				} else {
					if (!isNaN(config.argument)) {
						quote = await Quote.findOne({ index: config.argument });
						if (!quote) {
						}
					} else {
						quoteEntries = await Quote.find({
							text: { $regex: config.argument, $options: "i" },
						});
					}
				}

				if (quoteEntries.length > 0) {
					quote = getRandom(quoteEntries);
				} else if (isNaN(config.argument)) {
					reject = "No Starless quote found mentioning: " + config.argument;
				} else if (!config.argument) {
					reject = "Starless has never said anything of note";
				}

				if (quote) {
					result.push(quote.index + `. ` + quote.text);
				} else {
					if (!isNaN(config.argument)) {
						reject = "There is no Starless quote number " + config.argument;
					}
					result.push(reject);
				}
			}
			return result;
		},
	},
};

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

async function createDeathCounter(game, date) {
	let deathCounter = await DeathCounter.create({
		deaths: 0,
		gameTitle: game,
		streamStartDate: date,
	});

	return deathCounter;
}

async function setAllTimeStreamDeaths() {
	let deathCounters = await DeathCounter.find({}).exec();
	if (deathCounters.length > 0) {
		for (let i = 0; i < deathCounters.length; i++) {
			allTimeStreamDeaths = allTimeStreamDeaths + deathCounters[i].deaths;
		}
	}
}

function getRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function setApiClient(authProvider) {
	apiClient = new ApiClient({ authProvider });
}

exports.list = commands;
exports.setAllTimeStreamDeaths = setAllTimeStreamDeaths;
exports.setApiClient = setApiClient;