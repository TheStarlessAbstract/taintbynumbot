const axios = require("axios");

const Command = require("./models/command");
const DeathCounter = require("./models/deathcounter");
const Message = require("./models/message");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const Quote = require("./models/quote");
const Deck = require("./models/deck");
const AudioLink = require("./models/audiolink");

const audio = require("./bot-audio");
const messages = require("./bot-messages");
const redemptions = require("./bot-redemptions");

const TINDERCOOLDOWN = 30000;
const TITLECOOLDOWN = 30000;
const QUOTECOOLDOWN = 30000;

let twitchId = process.env.TWITCH_USER_ID;
let url = process.env.BOT_DOMAIN;

let audioLink;
let deathAudioLinks;
let allTimeStreamDeaths = 0;
let apiClient;
let gameStreamDeaths;
let time;
let tinderTimer;
let titleTimer;
let totalStreamDeaths = 0;
let quoteTimer;
let chatCommands;
let fLastUseTime = "";

const commands = {
	// card: {
	// 	response: async (config) => {
	// 		let result = [];
	// 		let suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
	// 		let values = [
	// 			{ value: "Ace", rule: "Musketeers: All for one and one for all", explanation: "Everybody drinks" },
	// 			{
	// 				value: "2",
	// 				rule: "Fuck you!",
	// 				explanation:
	// 					"Choose someone to take a drink...but fuck Starless mainly amirite?!",
	// 			},
	// 			{
	// 				value: "3",
	// 				rule: "Fuck me!",
	// 				explanation: "You drew this card, so you drink!",
	// 			},
	// 			{ value: "4", rule: "", explanation: "" },
	// 			{ value: "5", rule: "", explanation: "" },
	// 			{ value: "6", rule: "", explanation: "" },
	// 			{ value: "7", rule: "", explanation: "" },
	// 			{
	// 				value: "8",
	// 				rule: "Pick a mate!",
	// 				explanation:
	// 					"You and a person of your choosing takes a drink...tell us why it is Starless",
	// 			},
	// 			{
	// 				value: "9",
	// 				rule: "Bust a rhyme!",
	// 				explanation:
	// 					"Quickfire rhyming between you and Starless, whoever takes too long has to drink",
	// 			},
	// 			{
	// 				value: "10",
	// 				rule: "Make a rule!",
	// 				explanation:
	// 					"You get to make a rule for Starless, and maybe chat. Rule last until the next 10 is drawn, stream ends, or Starless gets tired of it",
	// 			},
	// 			{ value: "Jack", rule: "", explanation: "" },
	// 			{
	// 				value: "Queen",
	// 				rule: "Ask a question!",
	// 				explanation:
	// 					"Ask Starless a general knowledge question. Starless gets it right, you drink, Starless gets it wrong, Starless drinks",
	// 			},
	// 			{
	// 				value: "King",
	// 				rule: "Kings!",
	// 				explanation:
	// 					"The first three Kings drawn mean nothing, Starless may offer a sympathy drink. Draw the fourth King, and Starless owes a 'Chug, but not a chug, because Starless can't chug'",
	// 			},
	// 		];

	// 		let baseDeck = new Deck({ game: "base deck", cards: [] });

	// 		for (let i = 0; i < suits.length; i++) {
	// 			for (let j = 0; j < values.length; j++) {
	// 				baseDeck.cards.push({
	// 					suit: suits[i],
	// 					value: values[j].value,
	// 					rule: values[j].rule,
	// 					explanation: values[j].explanation,
	// 				});
	// 			}
	// 		}

	// 		await baseDeck.save();
	// 		console.log(baseDeck);

	// 		return result;
	// 	},
	// },
	addcomm: {
		response: async (config) => {
			let result = [];
			let commandName;
			let commandText;

			if (config.isModUp && config.argument) {
				if (config.argument.startsWith("!")) {
					commandName = config.argument.split(/\s(.+)/)[0].slice(1);
					commandText = config.argument.split(/\s(.+)/)[1];

					const { response } =
						(await commands[commandName.toLowerCase()]) || {};

					if (!commandText) {
						result.push([
							"To add a Command, you must include the Command name, and follwed by the Command output, new Command must start with '!' '!addcomm !Yen Rose would really appreciate it if Yen would step on her'",
						]);
					} else {
						if (
							!response &&
							!chatCommands.find((obj) => {
								return obj.name === commandName;
							})
						) {
							let newCommand = new Command({
								name: commandName,
								text: commandText,
								createdBy: config.userInfo.displayName,
							});
							commands[commandName] = {
								response: commandText,
							};
							chatCommands.push(newCommand);
							await newCommand.save();

							result.push(["!" + commandName + " has been created!"]);
						} else {
							result.push(["!" + commandName + " already exists"]);
						}
					}
				} else {
					result.push([
						"New command must start with '!' !addcomm !newcommand this is what a new command looks like",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!addComm command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a Command, you must include the Command name, and follwed by the the Command output, new Command must start with !: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'",
				]);
			}

			return result;
		},
	},
	addkings: {
		response: async (config) => {
			time = new Date();
			let result = [];
			let cardValue;
			let cardRule;

			if (config.isModUp && config.argument) {
				cardValue = config.argument.substring(0, config.argument.indexOf(" "));
				cardRule = config.argument.substring(config.argument.indexOf(" ") + 1);

				if (cardValue == cardRule) {
					result.push(
						"Looks like you are missing the rule or card, try again. !addkings Ace Some rule that will make Starless drink"
					);
				} else if (cardRule) {
					let response = await redemptions.addKingsRule(cardValue, cardRule);

					if (response) {
						result.push("New rule as been added");
					} else {
						result.push("These cards already have a rule, womp womp");
					}
				} else {
					result.push(
						"Something went wrong, I think. Try again !addkings 4 Some rule that will make Starless drink"
					);
				}
			}

			return result;
		},
	},
	addmessage: {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let messagesList = await messages.get();

				let message = await Message.create({
					text: config.argument,
					addedBy: config.userInfo.displayName,
				});
				messagesList.push(message);
				messages.update(messagesList);

				result.push(["Added new message"]);
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
	audiotimeout: {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				if (config.argument && !isNaN(config.argument)) {
					audio.setAudioTimeout(config.argument);
					result.push([
						"Bot audio timeout has been started, and set to " +
							config.argument +
							" seconds",
					]);
				} else if (config.argument && isNaN(config.argument)) {
					result.push([
						"To set the bot audio timeout length include the number of seconds for the timeout after the command: !audiotimeout 10",
					]);
				} else {
					audio.setAudioTimeout();
					let status = audio.getAudioTimeout() ? "started" : "stopped";
					result.push(["Bot audio timeout has been " + status]);
				}
			} else if (!config.isModUp) {
				result.push(["!audiotimeout command is for Mods only"]);
			}

			return result;
		},
	},
	booty: {
		response: "Who loves the booty?",
	},
	editcomm: {
		response: async (config) => {
			let result = [];
			let commandName;
			let commandText;

			if (config.isModUp && config.argument) {
				if (config.argument.startsWith("!")) {
					commandName = config.argument.split(/\s(.+)/)[0].slice(1);
					commandText = config.argument.split(/\s(.+)/)[1];

					const { response } =
						(await commands[commandName.toLowerCase()]) || {};

					if (!commandText) {
						result.push([
							"To edit a Command, you must include the Command name, and follwed by the new Command output, Command must start with '!' '!editcomm !Yen Rose would really appreciate it if Yen would step on her'",
						]);
					} else if (!response) {
						result.push(["No command found by this name !" + commandName]);
					} else {
						if (
							chatCommands.find((obj) => {
								return obj.name === commandName;
							})
						) {
							chatCommands.find((obj) => {
								if (obj.name === commandName) {
									obj.text = commandText;
								}
							});

							let editCommand = await Command.findOne({ name: commandName });

							commands[commandName] = {
								response: commandText,
							};

							editCommand.text = commandText;
							await editCommand.save();

							result.push(["!" + commandName + " has been edited!"]);
						} else {
							result.push([
								"!" +
									commandName +
									" is too spicy to be edited in chat, Starless is going to have to do some work for that, so ask nicely",
							]);
						}
					}
				} else {
					result.push([
						"Command being edited must start with '!' !editcomm !editcommand this is what an edit command looks like",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!editcomm command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To edit a Command, you must include the Command name, and follwed by the the Command output, edited Command must start with !: '!editcomm !Yen Rose would really appreciate it if Yen would step on her'",
				]);
			}

			return result;
		},
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
			let gamesPlayed;
			let pularlity;
			let gameDeaths = 0;
			let gameStreams;
			let timeSinceStartAsMs;
			let averageToDeathMs;
			let averageToDeath;
			let averageString = "";

			try {
				let stream = await apiClient.streams.getStreamByUserId(
					process.env.TWITCH_USER_ID
				);

				if (stream == null) {
					result.push(
						"Starless doesn't seem to be streaming right now, come back later"
					);
				} else {
					let currentTime = new Date();

					if (currentTime - fLastUseTime > 5000) {
						fLastUseTime = currentTime;
						gameName = stream.gameName;
						streamDate = stream.startDate;

						timeSinceStartAsMs = Math.floor(currentTime - streamDate);

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
								gameStreamDeaths = await createDeathCounter(
									gameName,
									streamDate
								);
							} else {
								for (let i = 0; i < deathCounters.length; i++) {
									totalStreamDeaths =
										totalStreamDeaths + deathCounters[i].deaths;
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
							} else if (gameStreamDeaths.streamStartDate != streamDate) {
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
						averageToDeathMs = timeSinceStartAsMs / gameStreamDeaths.deaths;

						averageToDeath = {
							hours: Math.floor((averageToDeathMs / (1000 * 60 * 60)) % 24),
							minutes: Math.floor((averageToDeathMs / (1000 * 60)) % 60),
							seconds: Math.floor((averageToDeathMs / 1000) % 60),
						};

						gameStreams = await DeathCounter.find({
							gameTitle: gameName,
						}).exec();

						if (gameStreams.length > 1) {
							for (let i = 0; i < gameStreams.length; i++) {
								gameDeaths = gameDeaths + gameStreams[i].deaths;
							}
						}

						audioLink = getRandom(deathAudioLinks);
						audio.play(audioLink);

						resp = await axios.post(url + "/deathcounter", {
							deaths: gameStreamDeaths.deaths,
							gameDeaths: gameDeaths,
							allDeaths: allTimeStreamDeaths,
							average: averageToDeath,
						});

						deathCounters = await DeathCounter.find({
							streamStartDate: streamDate,
						}).exec();

						gamesPlayed = deathCounters.length;

						let random = Math.floor(Math.random() * 100) + 1;
						if (random == 1) {
							pularlity = getPlurality(
								gameStreamDeaths.deaths,
								"death/fail",
								"deaths/fails"
							);

							result.push(
								"ThisIsFine ThisIsFine ThisIsFine it's only " +
									gameStreamDeaths.deaths +
									" " +
									pularlity +
									" ThisIsFine ThisIsFine ThisIsFine"
							);
						} else {
							pularlity = getPlurality(
								gameStreamDeaths.deaths,
								"time",
								"times"
							);

							result.push(
								"Starless has now died/failed " +
									gameStreamDeaths.deaths +
									" " +
									pularlity +
									" while playing " +
									gameStreamDeaths.gameTitle +
									" this stream"
							);

							if (random >= 13 && random <= 23) {
								pularlity = getPlurality(allTimeStreamDeaths, "time", "times");

								result.push(
									"Since records have started, Starless has died/failed a grand total of " +
										allTimeStreamDeaths +
										" " +
										pularlity
								);
							} else if (gamesPlayed > 1 && random >= 35 && random <= 45) {
								pularlity = getPlurality(totalStreamDeaths, "time", "times");

								result.push(
									"Starless has played " +
										gamesPlayed +
										" games this stream, and has died/failed about " +
										totalStreamDeaths +
										" " +
										pularlity
								);
							} else if (random >= 57 && random <= 67) {
								if (gameDeaths != 0) {
									pularlity = getPlurality(gameDeaths, "time", "times");

									result.push(
										"Starless has died/failed at least " +
											gameDeaths +
											" " +
											pularlity +
											", across all streams while playing " +
											gameStreams[0].gameTitle
									);
								}
							} else if (random >= 79 && random <= 89) {
								pularlity = getPlurality(gameDeaths, "time", "times");

								if (averageToDeath.hours > 0) {
									averageString = averageToDeath.hours + "h ";
								}
								if (averageToDeath.minutes > 0) {
									averageString = averageString + averageToDeath.minutes + "m ";
								}
								if (averageToDeath.seconds > 0) {
									averageString = averageString + averageToDeath.seconds + "s ";
								}

								result.push(
									"Starless is dying/failing on average every " +
										averageString +
										"this stream. Don't go getting your hopes up this time"
								);
							}
						}
					}
				}
			} catch (err) {
				console.log(err);
				result.push(
					"Twitch says no, and Starless should really sort this out some time after stream"
				);
			}

			return result;
		},
	},
	followage: {
		response: async (config) => {
			let result = [];

			const follow = await apiClient.users.getFollowFromUserToBroadcaster(
				config.userInfo.userId,
				twitchId
			);

			if (follow) {
				const currentTimestamp = Date.now();
				const followStartTimestamp = follow.followDate.getTime();

				let followLength = getFollowLength(
					currentTimestamp - followStartTimestamp
				);

				result.push([
					"@" +
						config.userInfo.displayName +
						" has been following TheStarlessAbstract for " +
						followLength,
				]);
			} else {
				result.push([
					"@" +
						config.userInfo.displayName +
						" hit that follow button, otherwise this command is doing a whole lot of nothing for you",
				]);
			}

			return result;
		},
	},
	kingsreset: {
		response: async (config) => {
			time = new Date();
			let result = [];

			if (config.isModUp) {
				redemptions.resetKings();
				result.push("Kings has been reset");
			}

			return result;
		},
	},
	lurk: {
		response: async (config) => {
			let result = [];

			result.push(
				config.userInfo.displayName +
					" finds a comfortable spot behind the bushes to perv on the stream"
			);

			return result;
		},
	},
	so: {
		response: async (config) => {
			let result = [];
			let username;
			let user;
			let stream;
			let streamed;

			if (config.isModUp) {
				if (config.argument) {
					username = config.argument;
					if (username.startsWith("@")) {
						username = username.slice(1);
					}

					user = await apiClient.users.getUserByName(username);

					if (!user) {
						result.push(["Couldn't find a user by the name of " + username]);
					} else {
						stream = await apiClient.channels.getChannelInfo(user.id);

						if (stream.gameName != "") {
							streamed = ", they last streamed " + stream.gameName;
						} else {
							streamed = "";
						}

						result.push(
							"Go check out " +
								username +
								" at twitch.tv/" +
								username +
								streamed +
								". I hear they love the Taint"
						);
					}
				} else {
					result.push([
						"You got to include a username to shoutout someone: !so buhhsbot",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!so command is for Mods only"]);
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
	updatemessages: {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				let messagesList = await messages.get();

				messages.update(messagesList);

				result.push(["Updated message list"]);
			} else if (!config.isModUp) {
				result.push(["!updateMessage command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a Tinder quote, you must include the quote after the command: '!addtinder Never mind about carpe diem, carpe taintum @design_by_rose'",
				]);
			}

			return result;
		},
	},
};

async function setup() {
	chatCommands = await Command.find({});
	deathAudioLinks = await AudioLink.find({ command: "f" }).exec();

	for (let i = 0; i < chatCommands.length; i++) {
		commands[chatCommands[i].name] = { response: chatCommands[i].text };
	}

	fLastUseTime = new Date();
}

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
	} else {
		allTimeStreamDeaths = 0;
	}
}

function getRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function getRandomBetween(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setApiClient(newApiClient) {
	apiClient = newApiClient;
}

function getPlurality(value, singular, plural) {
	let result;

	if (value > 1) {
		result = plural;
	} else {
		result = singular;
	}

	return result;
}

function getFollowLength(followTime) {
	let year, month, week, day, hour, minute, second;
	let followString = "";

	second = Math.floor(followTime / 1000);
	minute = Math.floor(second / 60);
	second = second % 60;
	hour = Math.floor(minute / 60);
	minute = minute % 60;
	day = Math.floor(hour / 24);
	hour = hour % 24;
	year = Math.floor(day / 365);
	day = day % 365;
	month = Math.floor(day / 30);
	day = day % 30;
	week = Math.floor(day / 7);
	day = day % 7;

	if (year > 0) {
		followString = followString.concat(
			year + " " + getPlurality(year, "year", "years") + ", "
		);
	}
	if (month > 0) {
		followString = followString.concat(
			month + " " + getPlurality(month, "month", "months") + ", "
		);
	}
	if (week > 0) {
		followString = followString.concat(
			week + " " + getPlurality(week, "week", "weeks") + ", "
		);
	}
	if (day > 0) {
		followString = followString.concat(
			day + " " + getPlurality(day, "day", "days") + ", "
		);
	}
	if (hour > 0) {
		followString = followString.concat(
			hour + " " + getPlurality(hour, "hour", "hours") + ", "
		);
	}
	if (minute > 0) {
		followString = followString.concat(
			minute + " " + getPlurality(minute, "minute", "minutes") + ", "
		);
	}
	followString = followString.concat(
		second + " " + getPlurality(second, "second", "seconds") + ". "
	);

	return followString;
}

exports.list = commands;
exports.setAllTimeStreamDeaths = setAllTimeStreamDeaths;
exports.setApiClient = setApiClient;
exports.setup = setup;
