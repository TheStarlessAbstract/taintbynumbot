require("dotenv").config();
const axios = require("axios");
const querystring = require("querystring");

const db = require("../bot-mongoose.js");
const twitchRepo = require("../repos/twitch.js");
const twitchService = require("../services/twitch.js");
const loyalty = require("../bot-loyalty.js");
const deck = require("../bot-deck.js");

const lurk = require("../commands/lurk.js");

const Command = require("../models/command.js");
const CommandNew = require("../models/commandnew.js");
const User = require("../models/user.js");

let clientId = process.env.TWITCH_CLIENT_ID;
let twitchId = 100612361;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;
let grantType = "refresh_token";
let chatClient;

const users = {};

describe("twitch", () => {
	beforeAll(async () => {
		await db.connectToMongoDB();
		// await twitchRepo.init();
		// twitchService.init();
		// chatClient = twitchRepo.getChatClient();
	});

	afterAll(async () => {
		// chatClient.quit();
		await db.disconnectFromMongoDB();
	});

	test("twitch", async () => {
		//Assemble
		let result = true;

		//Act
		let comm = lurkTemplate();

		await comm.save();

		let users = await User.find({ role: { $ne: "bot" } }, "twitchId").exec();
		let userIds = getUserIds(users);
		for (let i = 0; i < userIds.length; i++) {
			let activeCommands = await Command.find({
				streamerId: userIds[i],
				active: true,
			});

			let list = [];
			for (let j = 0; j < activeCommands.length; j++) {
				list.push({
					streamerId: activeCommands[j].streamerId,
					chatName: activeCommands[j].name,
					active: true,
					text: activeCommands[j].text,
					createdBy: activeCommands[j].createdBy,
					createdOn: activeCommands[j].createdOn,
				});
			}

			await CommandNew.insertMany(list);
		}

		//Assert
		expect(result).toBe(true);
	});
});

function getUserIds(users) {
	let userIds = [];

	for (let user of users) {
		userIds.push(user.twitchId);
	}

	return userIds;
}

function lurkTemplate() {
	return new CommandNew({
		streamerId: twitchId,
		chatName: "lurk",
		defaultName: "lurk",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"isLurking",
				{
					message:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"noArguement",
				{
					description:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
					minimumPermissionLevel: "users",
				},
			],
		]),
	});
}
