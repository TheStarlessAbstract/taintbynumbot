const { findOne } = require("../queries/redemptions");
const twitchRepo = require("../repos/twitch");
const { getRedemptionType } = require("../config/redemptionTypes");
const channelsService = require("../services/channels/channels");
let pubSubClient;

async function init() {
	pubSubClient = twitchRepo.getPubSubClient();
	const channels = channelsService.getAllChannels();
	if (channels.length === 0) return;
	const channelIds = [...channels.keys()];

	channelIds.forEach((channelId, key) => {
		pubSubClient.onRedemption(channelId, async (redeem) => {
			const channelName = channelsService.getChannelName(channelId);
			const redeemDetails = getRedeemDetails(redeem);
			const variableMap = createVariableMap(redeemDetails, channelName);
			const redeemName = redeemDetails.rewardTitle;

			let redemption = channelsService.getChannelRedemption(
				channelId,
				redeemName
			);

			if (!redemption) {
				const dbRedeem = await findOne({
					channelId,
					name: redeemName,
				});
				if (!dbRedeem) return;

				const redemptionType = getRedemptionType(dbRedeem.type);
				redemption = new redemptionType.class(
					channelId,
					channelName,
					redeemName,
					dbRedeem
				);
				redemption.setAction(redemptionType.action);
				channelsService.addChannelRedemption(channelId, redeemName, redemption);
			}

			const action = redemption.getAction();
			if (!action) return;
			action(redeemDetails, variableMap);
		});
	});
}

exports.init = init;

function getRedeemDetails(redeem) {
	const {
		id,
		message,
		redemptionDate,
		rewardCost,
		rewardId,
		rewardIsQueued,
		rewardPrompt,
		rewardTitle,
		status,
		userDisplayName,
		userId,
	} = redeem;

	return {
		id,
		message,
		redemptionDate,
		rewardCost,
		rewardId,
		rewardIsQueued,
		rewardPrompt,
		rewardTitle,
		status,
		userDisplayName,
		userId,
	};
}

function createVariableMap(redeem, channelName) {
	const {
		message,
		redemptionDate,
		rewardCost,
		rewardPrompt,
		rewardTitle,
		status,
		userDisplayName,
	} = redeem;

	return new Map([
		["channelName", channelName],
		["message", message],
		["date", redemptionDate],
		["cost", rewardCost],
		["prompt", rewardPrompt],
		["name", rewardTitle],
		["status", status],
		["user", userDisplayName],
		["cost", rewardCost],
	]);
}
