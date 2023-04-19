require("dotenv").config();

const SteamAPI = require("steamapi");
let steamApiKey = process.env.STEAM_WEB_API_KEY;
const steam = new SteamAPI(steamApiKey);

function getApi() {
	return steam;
}

exports.getApi = getApi;
