const redemptions = require("./bot-redemptions");
const loyalty = require("./bot-loyalty");

let apiClient;

async function init() {
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
