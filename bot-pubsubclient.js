const redemptions = require("./bot-redemptions");

// let apiClient;

async function init() {
	redemptions.init();
}

// async function getApiClient() {
// 	if (!apiClient) {
// 		await setup();
// 	}
// 	return apiClient;
// }

exports.init = init;
// exports.getApiClient = getApiClient;
