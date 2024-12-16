const getClipsForBroadcasterPaginated = require("../services/twitch/clips/getClipsForBroadcasterPaginated");
const getGamesByIds = require("../services/twitch/game/getGamesByIds");
const twitchRepo = require("../repos/twitch");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

let channelId = "100612361";

async function getClips() {
	await twitchRepo.init();

	let filter = { limit: 100 };
	const clips = await getClipsForBroadcasterPaginated(channelId, filter);
	const gameIds = [...new Set(clips.map((item) => item.gameId))];
	const games = await getGamesByIds(gameIds);

	for (let i = 0; i < clips.length; i++) {
		if (clips[i].title.startsWith("="))
			clips[i].title = `=CHAR(61)&"${clips[i].title}"`;
		clips[i].filename = "";
		clips[i].theme = "";
		clips[i].length = Math.floor(clips[i].duration);
		clips[i].editedTime = "";
		clips[i].edited = "No";
		clips[i].mobile = "No";
		clips[i].updatedCaptions = "";
		clips[i].afkReel = "No";
		clips[i].gifs = "";
		clips[i].soundboard = "";
		clips[i].deletion = "";
		clips[i].uses = "";
		clips[i].usedIn = "";

		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		const date = new Date(clips[i].creationDate);

		const day = date.getDate();
		const month = monthNames[date.getMonth()];
		const year = date.getFullYear();

		clips[i].date = `${month} ${day}, ${year}`;

		const game = games.find((game) => game.id === clips[i].gameId);

		if (game) clips[i].category = game.name;
		else clips[i].category = "";
	}

	clips.sort((a, b) => new Date(a.date) - new Date(b.date));

	const csvWriter = createCsvWriter({
		path: "output.csv",
		header: [
			{ id: "category", title: "Category" }, // query from gameId
			{ id: "title", title: "Clip Name" },
			{ id: "url", title: "Clip Url" },
			{ id: "filename", title: "Filename" },
			{ id: "theme", title: "Theme" },
			{ id: "length", title: "Original Time in Seconds" },
			{ id: "editedTime", title: "Edited Time in Seconds" },
			{ id: "edited", title: "Edited" },
			{ id: "mobile", title: "Mobile Version" },
			{ id: "updatedCaptions", title: "Updated Captions" },
			{ id: "afkReel", title: "In AFK Reel" },
			{ id: "gifs", title: "GIFs" },
			{ id: "soundboard", title: "Soundboard" },
			{ id: "deletion", title: "Deletion" },
			{ id: "uses", title: "Uses" },
			{ id: "usedIn", title: "Used In" },
			{ id: "creatorDisplayName", title: "Created By" },
			{ id: "date", title: "Created Date" },

			,
		],
	});

	csvWriter
		.writeRecords(clips)
		.then(() => console.log("CSV file created successfully!"))
		.catch((error) => console.error(error));
}

module.exports = getClips;
