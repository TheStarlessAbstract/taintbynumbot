const twitchRepo = require("./repos/twitch");
const twitchService = require("./services/twitch");
const redemptions = require("./bot-redemptions");

const loyalty = require("./bot-loyalty");

let apiClient;

async function init() {
	let repoResult = await twitchRepo.init();
	twitchService.init();
	redemptions.init();
	loyalty.init();
}

async function getApiClient() {
	if (!apiClient) {
		await setup();
	}
	return apiClient;
}

exports.init = init;
exports.getApiClient = getApiClient;
