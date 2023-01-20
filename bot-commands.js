const axios = require("axios");

const Command = require("./models/command");
const DeathCounter = require("./models/deathcounter");
const Message = require("./models/message");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const Quote = require("./models/quote");
const Deck = require("./models/deck");
const AudioLink = require("./models/audiolink");
const LoyaltyPoint = require("./models/loyaltypoint");
const KingsSaveState = require("./models/kingssavestate");

const audio = require("./bot-audio");
const messages = require("./bot-messages");
const discord = require("./bot-discord");

const TINDERCOOLDOWN = 30000;
const TITLECOOLDOWN = 30000;
const QUOTECOOLDOWN = 30000;
const KINGSCOOLDOWN = 5000;

let twitchId = process.env.TWITCH_USER_ID;
let url = process.env.BOT_DOMAIN;
let twitchUsername = process.env.TWITCH_USERNAME;

let audioLink;
let deathAudioLinks;
let drinkBitchAudioLinks;
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
let drinkBitchLastUseTime = "";
let kingsLastUseTime = "";
let kingsRemainLastUseTime = "";
let pointsLastUseTime = "";
let chugLastUseTime = "";
let deck;
let cardsToDraw;
let kingsCount;
let chatClient;
let suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
let values = [
	{
		value: "Ace",
		rule: "Musketeers: All for one and one for all",
		explanation: "Everybody drinks",
	},
	{
		value: "2",
		rule: "Fuck you!",
		explanation:
			"Choose someone to take a drink...but fuck Starless mainly amirite?!",
	},
	{
		value: "3",
		rule: "Fuck me!",
		explanation: "You drew this card, so you drink!",
	},
	{
		value: "4",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},
	{
		value: "5",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},
	{
		value: "6",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},
	{
		value: "7",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},
	{
		value: "8",
		rule: "Pick a mate!",
		explanation:
			"You and a person of your choosing takes a drink...tell us why it is Starless",
	},
	{
		value: "9",
		rule: "Bust a rhyme!",
		explanation:
			"Quickfire rhyming between you and Starless, whoever takes too long has to drink",
	},
	{
		value: "10",
		rule: "Make a rule!",
		explanation:
			"You get to make a rule for Starless, and maybe chat. Rule last until the next 10 is drawn, stream ends, or Starless gets tired of it",
	},
	{
		value: "Jack",
		rule: "This card doesn't really have a rule",
		explanation: "Hydrate you fools",
	},
	{
		value: "Queen",
		rule: "Ask a question!",
		explanation:
			"Ask Starless a general knowledge question. Starless gets it right, you drink, Starless gets it wrong, Starless drinks",
	},
	{
		value: "King",
		rule: "Kings!",
		explanation:
			"The first three Kings drawn mean nothing, Starless may offer a sympathy drink. Draw the fourth King, and Starless owes a 'Chug, but not a chug, because Starless can't chug'",
	},
];

const commands = {
	addcomm: {
		response: async (config) => {
			let result = [];
			let commandName;
			let commandText;

			// Check if user has privileges and argument is correct format
			if (
				config.isModUp &&
				config.argument &&
				config.argument.startsWith("!")
			) {
				// Extract command name and text from argument
				commandName = config.argument
					.split(/\s(.+)/)[0]
					.slice(1)
					.toLowerCase();
				commandText = config.argument.split(/\s(.+)/)[1];

				// Check if command already exists
				const { response, details } = commands[commandName] || {};

				// Check if text is included
				if (!response && commandText) {
					// Create new Command object and save to database
					let newCommand = new Command({
						name: commandName,
						text: commandText,
						createdBy: config.userInfo.displayName,
					});

					// Save new command
					await newCommand.save();
					// Update list of commands
					commands[commandName] = {
						response: commandText,
					};
					chatCommands.push(newCommand);

					// Return confirmation command was created
					result.push(["!" + commandName + " has been created!"]);

					discord.updateCommands("add", {
						name: commandName,
						description: commandText,
						usage: "!" + commandName,
						usableBy: "users",
					});
				} else if (response) {
					// Return message if command already exists
					result.push(["!" + commandName + " already exists"]);
				} else if (!commandText) {
					// Return message if no command text included
					result.push([
						"To add a Command, you must include the Command text: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'",
					]);
				}
			} else if (!config.isModUp) {
				// Return error message if user does not have privileges
				result.push(["!addComm command is for Mods only"]);
			} else if (!config.argument) {
				// Return error message if argument is not provided
				result.push([
					"To add a Command, you must include the Command name, and follwed by the the Command output, new Command must start with !: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'",
				]);
			} else if (!config.argument.startsWith("!")) {
				// Return error message if new command didn't start with an '!'
				result.push([
					"New command must start with '!' !addcomm !newcommand this is what a new command looks like",
				]);
			}

			return result;
		},
		versions: [
			{
				description: "Creates a new command",
				usage: "!addcomm !newcommand This is what a new command looks like",
				usableBy: "mods",
			},
		],
	},
	addmessage: {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let messagesList = await messages.get();
				try {
					let message = await Message.create({
						text: config.argument,
						addedBy: config.userInfo.displayName,
					});

					messagesList.push(message);
					messages.update(messagesList);

					result.push(["Added new message"]);
				} catch (err) {
					if (err.code == 11000) {
						result.push("This message has already been added");
					} else {
						console.log(err);
						result.push(
							"There was some problem adding this message, and Starless should really sort this shit out."
						);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!addmessage command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a timed message for the bot to say intermittently, you must include the message after the command: '!addmessage DM @design_by_rose for all your dick graphic needs'",
				]);
			}

			return result;
		},
		versions: [
			{
				description: "Creates a new timed message",
				usage: "!addmessage DM @design_by_rose for all your dick graphic needs",
				usableBy: "mods",
			},
		],
	},
	addtinder: {
		response: async (config) => {
			let message;
			let user;
			let result = [];

			if (config.isModUp && config.argument) {
				let tinderEntries = await Tinder.find({});

				const tinderIndex = tinderEntries.length
					? getNextIndex(tinderEntries)
					: 1;

				if (config.argument.includes("@")) {
					config.argument = config.argument.split("@");
					message = config.argument[0];
					user = config.argument[1];
				} else {
					message = config.argument;
					user = "";
				}

				try {
					await Tinder.create({
						index: tinderIndex,
						user: user,
						text: message,
						addedBy: config.userInfo.displayName,
					});
					result.push(["Added new Tinder bio"]);

					if (!user) {
						result.push([
							"To add the name of the author of this Tinder bio, use the command: !edittinderauthor " +
								tinderIndex +
								" @USERNAME",
						]);
					}
				} catch (err) {
					if (err.code == 11000) {
						result.push("This Tinder bio has already been added");
					} else {
						console.log(err);
						result.push(
							"There was some problem adding this Tinder bio, and Starless should really sort this shit out."
						);
					}
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
		versions: [
			{
				description: "To save Starless' new Tinder bio",
				usage:
					"!addtinder As long as my face is around, you will always have some place to sit",
				usableBy: "mods",
			},
		],
	},
	addtitle: {
		response: async (config) => {
			let message;
			let user;
			let result = [];
			let created;

			if (config.isModUp) {
				let titleEntries = await Title.find({});

				const titleIndex = titleEntries.length ? getNextIndex(titleEntries) : 1;

				if (!config.argument) {
					try {
						let channel = await apiClient.channels.getChannelInfo(twitchId);

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
							index: titleIndex,
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
		versions: [
			{
				description:
					"Saves a new, totally super funny, and not at all abusive title to Starless, likely created by Rose",
				usage:
					"!addtitle Streamer barely plays game, probably in the menu right now",
				usableBy: "mods",
			},
		],
	},
	addquote: {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let quoteEntries = await Quote.find({});

				const quoteIndex = quoteEntries.length ? getNextIndex(quoteEntries) : 1;

				try {
					await Quote.create({
						index: quoteIndex,
						text: config.argument,
						addedBy: config.userInfo.displayName,
					});
					result.push(["Quote added"]);
				} catch (err) {
					if (err.code == 11000) {
						result.push("This quote has already been added");
					} else {
						console.log(err);
						result.push(
							"There was some problem adding this quote, and Starless should really sort this shit out."
						);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!addquote command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a quote, you must include the quote after the command: '!addquote the mods totally never bully Starless'",
				]);
			}

			return result;
		},
		versions: [
			{
				description: "Saves a new, and totally out of context quote",
				usage: "!addquote Fuck fuck fuck fuck fuck",
				usableBy: "mods",
			},
		],
	},
	audiotimeout: {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				// check if argument is a positive number
				if (!isNaN(config.argument) && config.argument > 0) {
					audio.setAudioTimeout(config.argument);
					result.push([
						"Bot audio timeout has been started, and set to " +
							config.argument +
							" seconds",
					]);
				} // check if argument is a negative number
				else if (!isNaN(config.argument) && config.argument < 1) {
					result.push([
						"Please enter a positive number of seconds for the timeout after the command: !audiotimeout 10",
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
		versions: [
			{
				description:
					"Sets audio timeout for bot alerts to default length, or turns off the audio timeout",
				usage: "!audiotimeout",
				usableBy: "mods",
			},
			{
				description: "Sets the audio timeout to the specified about of seconds",
				usage: "!audiotimeout 3",
				usableBy: "mods",
			},
		],
	},
	buhhs: {
		response:
			"buhhsbot is a super amazing bot made by the super amazing @asdfWENDYfdsa. Go to https://www.twitch.tv/buhhsbot, and type !join in chat to have buhhsbot bootify your chat",
		versions: [
			{
				description: "For the glory of buhhs",
				usage: "!buhhs",
				usableBy: "users",
			},
		],
	},
	// chug: {
	// 	response: async (config) => {
	// 		let result = [];
	// 		let cost = 5000;

	// 		let currentTime = new Date();
	// 		// limit per stream, limit per user
	// 		if (currentTime - chugLastUseTime > 5000) {
	// 			chugLastUseTime = currentTime;

	// 			user = await LoyaltyPoint.findOne({
	// 				userId: config.userInfo.userId,
	// 			});

	// 			if (user) {
	// 				if (user.points >= cost) {
	// 					user.points -= cost;

	// 					user.save();

	// 					// audio.play(getRandomBetweenExclusiveMax(0, drinkBitchAudioLinks.length));

	// 					result.push("@TheStarlessAbstract chug, chug, chug!");
	// 				} else {
	// 					result.push(
	// 						"@" +
	// 							config.userInfo.displayName +
	// 							" you do not have power within you, the power to make Starless chug, please try again later, or you know, don't"
	// 					);
	// 				}
	// 			} else {
	// 				result.push(
	// 					"@" +
	// 						config.userInfo.displayName +
	// 						" It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !chug"
	// 				);
	// 			}
	// 		}

	// 		return result;
	// 	},
	// },
	delcomm: {
		response: async (config) => {
			let result = [];
			let commandToDelete;
			let commandName;
			let deletion;

			if (config.isModUp && config.argument) {
				if (config.argument.startsWith("!")) {
					commandName = config.argument.slice(1).toLowerCase();

					commandToDelete = await Command.findOne({ name: commandName });

					if (commandToDelete) {
						deletion = await Command.deleteOne({ name: commandName });

						if (deletion.deletedCount > 0) {
							delete commands[commandName];
							discord.updateCommands("delete", {
								name: commandName,
								description: commandToDelete.Text,
								usage: "!" + commandName,
								usableBy: "users",
							});
							result.push("!" + commandName + " has been deleted");
						} else {
							result.push(
								"!" + commandName + " has not been deleted, database says no?!"
							);
						}
					} else {
						result.push([
							"!" +
								commandName +
								" doesn't look to be a command, are you sure you spelt it right, dummy?!",
						]);
					}
				} else {
					result.push([
						"To specify the command to delete, include '!' at the start !delcomm !oldcommand",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!delcomm command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To delete a command, you must include the command name, command being deleted must start with '!' : '!delcomm !oldcommand",
				]);
			}

			return result;
		},
		versions: [
			{
				description: "Deletes a command",
				usage: "!delcomm !oldcommand",
				usableBy: "mods",
			},
		],
	},
	drinkbitch: {
		response: async (config) => {
			let result = [];
			let pointsRequired = 500;

			let currentTime = new Date();

			try {
				let user = await LoyaltyPoint.findOne({
					userId: config.userInfo.userId,
				});

				if (!user) {
					throw new Error("No user found");
				}

				if (user.points < pointsRequired) {
					throw new Error("Not enough points");
				}

				if (currentTime - drinkBitchLastUseTime < 5000) {
					throw new Error("Wait longer");
				}

				drinkBitchLastUseTime = currentTime;

				audio.play(
					drinkBitchAudioLinks[
						getRandomBetweenExclusiveMax(0, drinkBitchAudioLinks.length)
					]
				);

				result.push("@TheStarlessAbstract drink, bitch!");
				user.points -= pointsRequired;
				user.save();
			} catch (error) {
				if (error == "No user found") {
					result.push(
						"@" +
							config.userInfo.displayName +
							" It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkbitch"
					);
				} else if (error == "Not enough points") {
					if (getRandomBetweenInclusiveMax(1, 100) == 100) {
						audio.play(
							drinkBitchAudioLinks[
								getRandomBetweenExclusiveMax(0, drinkBitchAudioLinks.length)
							]
						);

						result.push(
							"@" +
								config.userInfo.displayName +
								" You lack the points to make Starless drink, but The Church of Latter-Day Taints takes pity on you. @TheStarlessAbstract drink, bitch!"
						);
					} else {
						result.push(
							"@" +
								config.userInfo.displayName +
								" You lack the points to make Starless drink, hang about stream if you have nothing better to do, and maybe you too can make Starless !drinkbitch"
						);
					}
				}
			}

			return result;
		},
		versions: [
			{
				description: "Makes Starless drink booze",
				usage: "!drinkbitch",
				usableBy: "users",
				cost: "500 Tainty Points",
			},
		],
	},
	editcomm: {
		response: async (config) => {
			let result = [];
			let commandName;
			let commandText;

			if (config.isModUp && config.argument) {
				if (config.argument.startsWith("!")) {
					commandName = config.argument
						.split(/\s(.+)/)[0]
						.slice(1)
						.toLowerCase();
					commandText = config.argument.split(/\s(.+)/)[1];

					const { response } = (await commands[commandName]) || {};

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
							discord.updateCommands("edit", {
								name: commandName,
								description: commandText,
								usage: "!" + commandName,
								usableBy: "users",
							});

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
		versions: [
			{
				description: "Edits an existing command",
				usage: "!editcomm !newCommand This is an edited command",
				usableBy: "mods",
			},
		],
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
		versions: [
			{
				description:
					"Updates the author of a Tinder bio, using the bio number and @user",
				usage: "!edittinderauthor 69 @design_by_rose",
				usableBy: "mods",
			},
		],
	},
	f: {
		response: async ({}) => {
			let result = [];
			let gamesPlayed;
			let pularlity;
			let averageString = "";

			try {
				let stream = await apiClient.streams.getStreamByUserId(twitchId);

				if (stream == null) {
					result.push(
						"Starless doesn't seem to be streaming right now, come back later"
					);
				} else {
					let currentTime = new Date();

					if (currentTime - fLastUseTime > 5000) {
						fLastUseTime = currentTime;
						let gameName = stream.gameName;
						let streamDate = stream.startDate;
						let timeSinceStartAsMs = Math.floor(currentTime - streamDate);

						streamDate = new Date(
							streamDate.getFullYear(),
							streamDate.getMonth(),
							streamDate.getDate()
						);

						let deathCounters = await DeathCounter.find({
							streamStartDate: streamDate,
						}).exec();

						// This function checks if there is currently a stored gameStreamDeaths object
						// if the gameTitle, and streamStartDate match with the current stream, then that object is passed back as gameStreamDeaths
						// if the gameTitle or streamStartDate don't match, then the deathCounters array is seatched to find an object with that gameTitle
						// if the game is found, is is passed back as gameDeathCounter
						// if the game is not found, a new DeathCounter is created, using createDeathCounter, passing in the gameName, and streamDate
						gameStreamDeaths = await getDeathCounter(
							gameName,
							streamDate,
							gameStreamDeaths,
							deathCounters
						);

						for (let i = 0; i < deathCounters.length; i++) {
							totalStreamDeaths += deathCounters[i].deaths;
						}

						gameStreamDeaths.deaths++;
						totalStreamDeaths++;
						allTimeStreamDeaths++;
						gameStreamDeaths.save();
						let averageToDeathMs = timeSinceStartAsMs / gameStreamDeaths.deaths;

						let averageToDeath = {
							hours: Math.floor(averageToDeathMs / (1000 * 60 * 60)),
							minutes: Math.floor((averageToDeathMs / (1000 * 60)) % 60),
							seconds: Math.floor((averageToDeathMs / 1000) % 60),
						};

						let gameStreams = await DeathCounter.find({
							gameTitle: gameName,
						}).exec();

						let gameDeaths = gameStreams.reduce(
							(total, stream) => total + stream.deaths,
							0
						);

						audioLink =
							gameDeaths == 666
								? await AudioLink.findOne({ name: "666" })
								: getRandomBetweenExclusiveMax(0, deathAudioLinks.length);

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
		versions: [
			{
				description:
					"To keep track of my many, many, many, many, many deaths/failures",
				usage: "!f",
				usableBy: "users",
			},
		],
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
		versions: [
			{
				description:
					"How long has it been since you last unfollowed, and then refollowed",
				usage: "!followage",
				usableBy: "users",
			},
		],
	},
	kings: {
		response: async (config) => {
			let result = [];
			let cost = 100;
			let redeemUser = config.userInfo.userName;
			let cardDrawn;

			let currentTime = new Date();

			if (currentTime - kingsLastUseTime > KINGSCOOLDOWN) {
				kingsLastUseTime = currentTime;

				// get user by userId
				user = await LoyaltyPoint.findOne({
					userId: config.userInfo.userId,
				});

				if (user) {
					if (user.points >= cost) {
						user.points -= cost;

						let drawFrom = cardsToDraw.filter((card) => card.isDrawn == false);

						if (drawFrom.length == 1) {
							cardDrawn = drawFrom[0];
						} else {
							cardDrawn =
								drawFrom[getRandomBetweenInclusiveMax(0, drawFrom.length - 1)];
						}

						cardDrawn.isDrawn = true;

						if (cardDrawn.value == "King") {
							kingsCount++;
						}

						result.push([
							"@" +
								redeemUser +
								" You have drawn the " +
								cardDrawn.value +
								" of " +
								cardDrawn.suit,
						]);

						if (kingsCount != 4) {
							result.push([
								"Rule: " + cardDrawn.rule + " || " + cardDrawn.explanation,
							]);

							if (cardDrawn.bonusJager) {
								audioLink = await AudioLink.findOne({ name: "jager" });
								audio.play(audioLink);
								result.push([
									"A wild Jagerbomb appears, Starless uses self-control. Was it effective?",
								]);
							}

							if (cardDrawn.value == "Queen") {
								audioLink = await AudioLink.findOne({
									name: "Check out the big brain Brad",
								});
								audio.play(audioLink);
							} else if (cardDrawn.value == "Ace") {
								audioLink = await AudioLink.findOne({
									name: "The Greater Good",
								});
								audio.play(audioLink);
							}
						} else {
							result.push([
								"King number 4, time for Starless to chug, but not chug, because he can't chug. Pfft, can't chug.",
							]);

							kingsCount = 0;
						}

						// checks if card drawn is last card
						if (drawFrom.length == 1) {
							resetKings();
						}

						user.save();
					} else {
						result.push(
							"@" +
								config.userInfo.displayName +
								" You lack the points to draw a card, hang about stream if you have nothing better to do, eventually you may be able to find a Jagerbomb"
						);
					}
				} else {
					result.push(
						"@" +
							config.userInfo.displayName +
							" I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points."
					);
				}
			}
			return result;
		},
		versions: [
			{
				description: "Draw a card in the Kings game",
				usage: "!kings",
				usableBy: "users",
				cost: "100 Tainty Points",
			},
		],
	},
	kingsremain: {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (currentTime - kingsRemainLastUseTime > 5000) {
				kingsRemainLastUseTime = currentTime;

				let cardsRemain = cardsToDraw.filter((card) => {
					return card.isDrawn == false;
				});

				result.push("Cards remaing in this game " + cardsRemain.length);
			}
			return result;
		},
		versions: [
			{
				description:
					"Checks how many cards remaining in the deck for the current game of !kings",
				usage: "!kingsremain",
				usableBy: "users",
			},
		],
	},
	kingsreset: {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				resetKings();
				result.push(
					"A new game of Kings has been dealt, with " +
						cardsToDraw.length +
						" cards!"
				);
			}

			return result;
		},
		versions: [
			{
				description: "Resets !kings to a brand new deck",
				usage: "!kingsreset",
				usableBy: "mods",
			},
		],
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
		versions: [
			{
				description:
					"Let the stream know you are going to lurk for a while...please come back",
				usage: "!lurk",
				usableBy: "users",
			},
		],
	},
	points: {
		response: async (config) => {
			let result = [];
			let user;

			let currentTime = new Date();

			if (currentTime - pointsLastUseTime > 5000 || config.isModUp) {
				pointsLastUseTime = currentTime;

				if (!config.argument) {
					user = await LoyaltyPoint.findOne({
						userId: config.userInfo.userId,
					});

					if (user) {
						result.push(
							"@" +
								config.userInfo.displayName +
								" has " +
								user.points +
								" Tainty Points"
						);
					} else {
						result.push(
							"@" +
								config.userInfo.displayName +
								" I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points."
						);
					}
				} else if (config.isBroadcaster && isNaN(config.argument)) {
					let username;
					if (config.argument.startsWith("@")) {
						username = config.argument.substring(1).split(" ");
					} else {
						username = config.argument.split(" ");
					}
					if (username.length == 2) {
						let newPoints = username[1];
						username = username[0];

						user = await apiClient.users.getUserByName(username.toLowerCase());

						user = await LoyaltyPoint.findOne({
							userId: user.id,
						});

						user.points += Number(newPoints);
						await user.save();

						result.push(
							"Our glorious leader Starless, has given @" +
								username +
								" " +
								newPoints +
								" Tainty Points"
						);
					} else {
						result.push(
							"@TheStarlessAbstract it's not that hard, just !points username number"
						);
					}
				} else if (config.isBroadcaster && !isNaN(config.argument)) {
					result.push(
						"@TheStarlessAbstract you used the command wrong, you utter swine"
					);
				} else if (!config.isBroadcaster && config.argument) {
					result.push(
						"@" +
							config.userInfo.displayName +
							" you aren't allowed to this command like that"
					);
				}
			}

			return result;
		},
		versions: [
			{
				description:
					"Check how many Tainty Points you have. You are going to need some for !drinkbitch, and !kings",
				usage: "!points",
				usableBy: "users",
			},
			{
				description: "Give points to a user",
				usage: "!points 2000 @buhhsbot",
				usableBy: "streamer",
			},
		],
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
		versions: [
			{
				description: "Gives a shoutout to some wonderful user",
				usage: "!so @buhhsbot",
				usableBy: "mods",
			},
		],
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
					quote = getRandomBetweenExclusiveMax(0, quoteEntries.length);
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
		versions: [
			{
				description: "Gets a random Tinder Bio",
				usage: "!tinderquote",
				usableBy: "users",
			},
			{
				description: "Gets Tinder Bio number 69",
				usage: "!tinderquote 69",
				usableBy: "users",
			},
			{
				description:
					"Gets a random Tinder Bio that includes the string 'sit on my face' uwu",
				usage: "!tinderquote sit on my face",
				usableBy: "users",
			},
		],
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
					quote = getRandomBetweenExclusiveMax(0, quoteEntries.length);
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
						reject = "There is no title number " + config.argument;
					}
					result.push(reject);
				}
			}

			return result;
		},
		versions: [
			{
				description: "Gets a random title",
				usage: "!titleharassment",
				usableBy: "users",
			},
			{
				description: "Gets title number 69",
				usage: "!titleharassment 69",
				usableBy: "users",
			},
			{
				description:
					"Gets a random title that includes the string 'sit on my face' uwu",
				usage: "!titleharassment sit on my face",
				usableBy: "users",
			},
		],
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
					quote = getRandomBetweenExclusiveMax(0, quoteEntries.length);
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
		versions: [
			{
				description: "Gets a random quote",
				usage: "!quote",
				usableBy: "users",
			},
			{
				description: "Gets quote number 69",
				usage: "!quote 69",
				usableBy: "users",
			},
			{
				description:
					"Gets a random quote that includes the string 'sit on my face' uwu",
				usage: "!quote sit on my face",
				usableBy: "users",
			},
		],
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
		versions: [
			{
				description: "Updates random bot message list",
				usage: "!updatemessages",
				usableBy: "mods",
			},
		],
	},
};

async function setup() {
	chatCommands = await Command.find({});
	deathAudioLinks = await AudioLink.find({ command: "f" }).exec();
	drinkBitchAudioLinks = await AudioLink.find({ command: "drinkbitch" }).exec();

	for (const command of chatCommands) {
		commands[command.name] = { response: command.text };
	}

	const currentDateTime = new Date();
	fLastUseTime = currentDateTime;
	chugLastUseTime = currentDateTime;
	kingsLastUseTime = currentDateTime;
	pointsLastUseTime = currentDateTime;
	drinkBitchLastUseTime = currentDateTime;
	kingsRemainLastUseTime = currentDateTime;
}

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

async function createDeathCounter(game, date) {
	return await DeathCounter.create({
		deaths: 0,
		gameTitle: game,
		streamStartDate: date,
	});
}

async function setAllTimeStreamDeaths() {
	let deathCounters = await DeathCounter.find({}).exec();
	allTimeStreamDeaths = deathCounters.reduce(
		(total, counter) => total + counter.deaths,
		0
	);
}

function getRandomBetweenExclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomBetweenInclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCommands() {
	// Create the commandList array using the Array.map() method
	const commandList = Object.entries(commands).map(([key, value]) => {
		// Use a ternary operator to check for the existence of the versions property
		return value.versions
			? // If the versions property exists, return an object with the command name and versions
			  { name: key, versions: value.versions }
			: // If the versions property does not exist, return an object with the command name and default version information
			  {
					name: key,
					versions: [
						{
							description: value.response,
							usage: "!" + key,
							usableBy: "users",
						},
					],
			  };
	});

	// Use the Array.sort() method to sort the commandList array alphabetically by command name
	commandList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
	return commandList;
}

function getFollowLength(followTime) {
	// Convert the followTime timestamp into individual time units
	let second = Math.floor(followTime / 1000);
	let minute = Math.floor(second / 60);
	second = second % 60;
	let hour = Math.floor(minute / 60);
	minute = minute % 60;
	let day = Math.floor(hour / 24);
	hour = hour % 24;
	let year = Math.floor(day / 365);
	day = day % 365;
	let month = Math.floor(day / 30);
	day = day % 30;
	let week = Math.floor(day / 7);
	day = day % 7;

	// Create an array of time unit objects, each with a value and a name
	const timeUnits = [
		{ value: year, name: "year" },
		{ value: month, name: "month" },
		{ value: week, name: "week" },
		{ value: day, name: "day" },
		{ value: hour, name: "hour" },
		{ value: minute, name: "minute" },
		{ value: second, name: "second" },
	];

	// Use a for loop to iterate over the timeUnits array and construct the final string
	let followString = "";
	for (const timeUnit of timeUnits) {
		if (timeUnit.value > 0) {
			followString +=
				timeUnit.value +
				" " +
				(timeUnit.value > 1 ? timeUnit.name + "s" : timeUnit.name);
			(", ");
		}
	}

	// Remove the final comma and space from the string
	followString = followString.slice(0, -2);
	followString += ".";

	return followString;
}

async function resetKings() {
	// Reset the game of Kings to its initial state.
	// If a save state is found, restore the game from that state.

	// Find the current save state for the game of Kings.
	let gameState = await KingsSaveState.findOne({});

	// If there is no save state, initialize the game.
	if (!gameState) {
		// Initialize the game state.
		await initializeGameState();
	} else {
		// Restore the game state from the save state.
		restoreGameState(gameState);

		// Delete the save state.
		await KingsSaveState.deleteOne({ _id: gameState._id });
	}
}

async function initializeGameState() {
	// This array will hold the indices of the "Hydrate you fools" cards,
	// which will be eligible for the Jagerbomb bonus.
	let jagerBonusCards = [];
	let jagerCardIndex;

	// Create the array of cards to draw.
	cardsToDraw = [];
	kingsCount = 0;

	if (!deck) {
		deck = await createDeck(suits, values);
	}

	// Loop through the cards in the deck.
	for (let i = 0; i < deck.cards.length; i++) {
		// Add the "Hydrate you fools" cards to the array of cards eligible
		// for the Jagerbomb bonus.
		if (deck.cards[i].explanation === "Hydrate you fools") {
			jagerBonusCards.push(i);
		}

		// cards used in play
		cardsToDraw.push({
			suit: deck.cards[i].suit,
			value: deck.cards[i].value,
			rule: deck.cards[i].rule,
			explanation: deck.cards[i].explanation,
			isDrawn: false,
			bonusJager: false,
		});
	}

	// Choose two of the "Hydrate you fools" cards to be Jagerbomb cards.
	for (let i = 0; i < 2; i++) {
		jagerCardIndex = getRandomBetweenExclusiveMax(0, jagerBonusCards.length);
		cardsToDraw[jagerBonusCards[jagerCardIndex]].bonusJager = true;
		jagerBonusCards.splice(jagerCardIndex);
	}

	// Shuffle the cards to draw.
	shuffle();
}

async function saveKingsState() {
	let saveState = new KingsSaveState({
		cardsToDraw: cardsToDraw,
		kingsCount: kingsCount,
	});

	await saveState.save();
}

// The shuffle function takes an array of items and shuffles them in place.
function shuffle() {
	// Get the number of items in the array.
	let m = cardsToDraw.length,
		// Temporary variable for swapping items.
		t,
		// Loop variable.
		i;

	// While there are items to shuffle…
	while (m) {
		// Pick a random item from the array.
		i = Math.floor(Math.random() * m--);

		// Swap the last item in the array yet to be shuffled with the random item.
		t = cardsToDraw[m];
		cardsToDraw[m] = cardsToDraw[i];
		cardsToDraw[i] = t;
	}
}

async function createDeck(suits, values) {
	let newDeck = await Deck.findOne({});

	if (!newDeck) {
		newDeck = new Deck({ cards: [] });

		// Add cards to the deck for each suit and value.
		suits.forEach((suit) => {
			values.forEach((value) => {
				newDeck.cards.push({
					suit: suit,
					value: value.value,
					rule: value.rule,
					explanation: value.explanation,
				});
			});
		});

		// Save the deck to the database and return it.
		await newDeck.save();
	}

	return newDeck;
}

const getDeathCounter = async (
	gameName,
	streamDate,
	gameStreamDeaths,
	deathCounters
) => {
	let gameDeathCounter;

	if (
		gameStreamDeaths.gameTitle === gameName &&
		gameStreamDeaths.streamStartDate === streamDate
	) {
		gameDeathCounter = gameStreamDeaths;
	} else {
		gameDeathCounter = deathCounters.find((dc) => dc.gameTitle === gameName);

		if (!gameDeathCounter) {
			gameDeathCounter = createDeathCounter(gameName, streamDate);
		}
	}

	return gameDeathCounter;
};

// Restore the game state from the given save state.
function restoreGameState(gameState) {
	cardsToDraw = gameState.cardsToDraw;
	kingsCount = gameState.kingsCount;
}

function setChatClient(newChatClient) {
	chatClient = newChatClient;
}

function setApiClient(newApiClient) {
	apiClient = newApiClient;
}

exports.list = commands;
exports.setAllTimeStreamDeaths = setAllTimeStreamDeaths;
exports.setApiClient = setApiClient;
exports.setup = setup;
exports.saveKingsState = saveKingsState;
exports.resetKings = resetKings;
exports.setChatClient = setChatClient;
exports.getCommands = getCommands;
