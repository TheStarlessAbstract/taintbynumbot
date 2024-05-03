require("dotenv").config();
const db = require("../../../bot-mongoose.js");
const game = require("../../commands/game.js");
const twitchRepo = require("../../../repos/twitch.js");
const twitchService = require("../../../services/twitch.js");
const command = game.getCommand();
const { searchCategories } = require("../../services/twitch/search");

describe("game command", () => {
	beforeAll(async () => {
		await db.connectToMongoDB();
		await twitchRepo.init();
		twitchService.init();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("'!game' - when stream is live, should return message about game being streamed", async () => {
		// Assemble
		const config = {
			versionKey: "noArgument",
			channelId: "100612361",
			argument: "",
			output: new Map([
				[
					"noStream",
					{
						message:
							"@{displayName} - {channelName} doesn't seem to be streaming right now",
						active: true,
					},
				],
				[
					"streamIsLive",
					{
						message: "@{displayName} -> {channelName} is playing {gameName}",
						active: true,
					},
				],
				[
					"gameNotFound",
					{
						message: "@{displayName} no game found by that name.",
						active: true,
					},
				],
				[
					"gameFound",
					{
						message:
							"@{displayName} -> The stream game has been set to: {gameName}",
						active: true,
					},
				],
			]),
			versions: new Map([
				[
					"noArgument",
					{
						isArgumentOptional: false,
						hasArgument: false,
						isArgumentNumber: false,
						description: "Gets current game category for the stream",
						active: true,
						usableBy: [
							"broadcaster",
							"artists",
							"founders",
							"mods",
							"subs",
							"vips",
							"viewers",
						],
						cooldown: {
							length: 10000,
							lastUsed: new Date(),
							bypassRoles: ["broadcaster", "mods"],
						},
					},
				],
				[
					"stringArgument",
					{
						isArgumentOptional: false,
						hasArgument: true,
						isArgumentNumber: false,
						description: "Sets the currenty game category for the stream",
						active: true,
						usableBy: ["broadcaster", "mods"],
						cooldown: {
							length: 5000,
						},
					},
				],
			]),
			configMap: new Map([
				["channelName", "TheStarlessAbstract"],
				["displayName", "buhhsbot"],
				["gameName", ""],
			]),
		};

		// Act
		const result = await command(config);

		// Assert
		expect(result).toBe(
			"@buhhsbot -> TheStarlessAbstract is playing Software and Game Development"
		);
	});

	test("'!game {gameName' - when stream is live, should change game category", async () => {
		// Assemble
		const config = {
			versionKey: "stringArgument",
			channelId: "100612361",
			argument: "Baldur's Gate 3",
			output: new Map([
				[
					"noStream",
					{
						message:
							"@{displayName} - {channelName} doesn't seem to be streaming right now",
						active: true,
					},
				],
				[
					"streamIsLive",
					{
						message: "@{displayName} -> {channelName} is playing {gameName}",
						active: true,
					},
				],
				[
					"gameNotFound",
					{
						message: "@{displayName} no game found by that name.",
						active: true,
					},
				],
				[
					"gameFound",
					{
						message:
							"@{displayName} -> The stream game has been set to: {gameName}",
						active: true,
					},
				],
			]),
			versions: new Map([
				[
					"noArgument",
					{
						isArgumentOptional: false,
						hasArgument: false,
						isArgumentNumber: false,
						description: "Gets current game category for the stream",
						active: true,
						usableBy: [
							"broadcaster",
							"artists",
							"founders",
							"mods",
							"subs",
							"vips",
							"viewers",
						],
						cooldown: {
							length: 10000,
							lastUsed: new Date(),
							bypassRoles: ["broadcaster", "mods"],
						},
					},
				],
				[
					"stringArgument",
					{
						isArgumentOptional: false,
						hasArgument: true,
						isArgumentNumber: false,
						description: "Sets the currenty game category for the stream",
						active: true,
						usableBy: ["broadcaster", "mods"],
						cooldown: {
							length: 5000,
						},
					},
				],
			]),
			configMap: new Map([
				["channelName", "TheStarlessAbstract"],
				["displayName", "buhhsbot"],
				["gameName", ""],
			]),
		};

		// Act
		const result = await command(config);

		// Assert
		expect(result).toBe(
			"@buhhsbot -> TheStarlessAbstract is playing Software and Game Development"
		);
	});

	test("Search", async () => {
		// Assemble
		let name = "ass's c";

		// Act
		let games = await searchCategories(name, { limit: 100 });
		let filteredGames = games.data.filter((game) => {
			const gameNameLowerCase = game.name.toLowerCase();
			const queryNameLowerCase = name.toLowerCase();
			return gameNameLowerCase.startsWith(queryNameLowerCase);
		});

		let gameStreams;
		let gameRanking = [];
		for (let i = 0; i < filteredGames.length; i++) {
			gameStreams = await filteredGames[i].getStreams();
			let viewers = 0;
			for (let j = 0; j < gameStreams.data.length; j++) {
				viewers += gameStreams.data[j].viewers;
			}

			gameRanking.push({
				id: filteredGames[i].id,
				name: filteredGames[i].name,
				viewers: viewers,
			});
		}
		gameRanking.sort((a, b) => b.viewers - a.viewers);

		console.log(gameRanking[0]);

		// Assert
		expect(gameRanking[0]).toBe("512923");
	});
});
