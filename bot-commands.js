const AudioLink = require("./models/audiolink");
const Command = require("./models/command");
const DeathCounter = require("./models/deathcounter");
const Deck = require("./models/deck");
const KingsSaveState = require("./models/kingssavestate");
const Message = require("./models/message");

const audio = require("./bot-audio");
const messages = require("./bot-messages");
const discord = require("./bot-discord");

const audioTimeout = require("./commands/audiotimeout");
const buhhs = require("./commands/buhhs");
const deaths = require("./commands/deaths");
const drinkBitch = require("./commands/drinkbitch");
const f = require("./commands/f");
const followage = require("./commands/followage");
const kings = require("./commands/kings");
const lurk = require("./commands/lurk");
const points = require("./commands/points");
const quoteAdd = require("./commands/quote-add");
const quote = require("./commands/quote");
const shoutout = require("./commands/shoutout");
const tinderAdd = require("./commands/tinder-add");
const tinderEditAuthor = require("./commands/tinder-editauthor");
const tinder = require("./commands/tinder");
const titleAdd = require("./commands/title-add");
const title = require("./commands/title");

let apiClient;
let chatCommands;
let kingsRemainLastUseTime = "";
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
	addtinder: tinderAdd.getCommand(),
	addtitle: titleAdd.getCommand(),
	addQuote: quoteAdd.getCommand(),
	audiotimeout: audioTimeout.getCommand(),
	buhhs: buhhs.getCommand(),
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
	deaths: deaths.getCommand(),
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
	drinkbitch: drinkBitch.getCommand(),
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
	edittinderauthor: tinderEditAuthor.getCommand(),
	f: f.getCommand(),
	followage: followage.getCommand(),
	kings: kings.getCommand(),
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
	lurk: lurk.getCommand(),
	points: points.getCommand(),
	so: shoutout.getCommand(),
	tinderquote: tinder.getCommand(),
	titleharassment: title.getCommand(),
	quote: quote.getCommand(),
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
	f.updateAudioLinks();
	f.setAllTimeStreamDeaths();
	f.setTotalStreamDeaths();
	f.setTotalGameDeaths();
	drinkBitch.updateAudioLinks();

	for (const command of chatCommands) {
		commands[command.name] = { response: command.text };
	}

	const currentDateTime = new Date();
	drinkBitch.setTimer(currentDateTime);
	points.setTimer(currentDateTime);
	quote.setTimer(currentDateTime);
	tinder.setTimer(currentDateTime);
	title.setTimer(currentDateTime);
	f.setTimer(currentDateTime);
	// chugLastUseTime = currentDateTime;
	kings.setTimer(currentDateTime);
	kingsRemainLastUseTime = currentDateTime;
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

function getCommands() {
	const commandList = Object.entries(commands).map(([key, value]) => {
		return value.versions
			? { name: key, versions: value.versions }
			: {
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

	commandList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
	return commandList;
}

async function resetKings() {
	let gameState = await KingsSaveState.findOne({});

	if (!gameState) {
		await initializeGameState();
	} else {
		restoreGameState(gameState);
		await KingsSaveState.deleteOne({ _id: gameState._id });
	}
}

async function initializeGameState() {
	let jagerBonusCards = [];
	let jagerCardIndex;

	cardsToDraw = [];
	kingsCount = 0;

	if (!deck) {
		deck = await createDeck(suits, values);
	}

	for (let i = 0; i < deck.cards.length; i++) {
		if (deck.cards[i].explanation === "Hydrate you fools") {
			jagerBonusCards.push(i);
		}

		cardsToDraw.push({
			suit: deck.cards[i].suit,
			value: deck.cards[i].value,
			rule: deck.cards[i].rule,
			explanation: deck.cards[i].explanation,
			isDrawn: false,
			bonusJager: false,
		});
	}

	for (let i = 0; i < 2; i++) {
		jagerCardIndex = getRandomBetweenExclusiveMax(0, jagerBonusCards.length);
		cardsToDraw[jagerBonusCards[jagerCardIndex]].bonusJager = true;
		jagerBonusCards.splice(jagerCardIndex);
	}

	shuffle();
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

		await newDeck.save();
	}

	return newDeck;
}

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
exports.resetKings = resetKings;
exports.setChatClient = setChatClient;
exports.getCommands = getCommands;
