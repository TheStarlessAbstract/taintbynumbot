const twitchRepo = require("../../../repos/twitch");

const updateRedemptionStatusByIds = async (
	broadcaster,
	rewardId,
	redemptionIds,
	status
) => {
	const apiClient = twitchRepo.getApiClient();

	try {
		await apiClient.channelPoints.updateRedemptionStatusByIds(
			broadcaster,
			rewardId,
			redemptionIds,
			status
		);
	} catch (err) {
		console.error(err);
	}
};

module.exports = updateRedemptionStatusByIds;
