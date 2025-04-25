const { findOne } = require("../queries/redemptions");
const twitchRepo = require("../repos/twitch");
const { getRedemptionType } = require("../config/redemptionTypes");
const channelsService = require("../services/channels/channels");
let eventSubListener;

async function init() {
	eventSubListener = twitchRepo.getEventSubListener();
	const channels = channelsService.getAllChannels();
	if (channels.length === 0) return;
	const channelIds = [...channels.keys()];

	channelIds.forEach(async (channelId, key) => {
		await eventSubListener.start();

		// Example: Subscribe to stream online events
		eventSubListener.onStreamOnline(channelId, (e) => {
			console.log(
				`Stream online event: ${e.broadcasterDisplayName} is now live!`
			);
			// io.emit("streamOnline", e); // Emit to socket.io clients
		});

		// Example: Subscribe to channel point redemption events
		eventSubListener.onChannelRedemptionAdd(channelId, async (e) => {
			const channelName = channelsService.getChannelName(channelId);
			const redeemDetails = getRedeemDetails(e);
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

			console.log(`${redeemName}, redeemed by ${e.userDisplayName}`);
			// io.emit("streamOnline", e); // Emit to socket.io clients
		});

		// // Example: Subscribe to channel update events
		// eventSubListener.onChannelUpdate(channelId, (e) => {
		// 	console.log(
		// 		`Channel update event: ${e.broadcasterDisplayName} updated their channel!`
		// 	);
		// 	io.emit("channelUpdate", e);
		// });

		// // Example: Subscribe to channel follow events
		// eventSubListener.onChannelFollow(channelId, channelId, (e) => {
		// 	console.log(`${e.userName} followed ${e.broadcasterDisplayName}`);
		// 	io.emit("channelFollow", e);
		// });

		// // Example: Subscribe to channel subscribe events
		// eventSubListener.onChannelSubscription(channelId, (e) => {
		// 	console.log(`${e.userName} subscribed to ${e.broadcasterDisplayName}`);
		// 	io.emit("channelSubscribe", e);
		// });

		// // Example: Subscribe to channel raid from events.
		// eventSubListener.onChannelRaidFrom(channelId, (e) => {
		// 	console.log(
		// 		`${e.fromBroadcasterDisplayName} raided ${e.toBroadcasterDisplayName} with ${e.viewers} viewers`
		// 	);
		// 	io.emit("channelRaid", e);
		// });

		// // Example: Subscribe to channel raid to events.
		// eventSubListener.onChannelRaidTo(channelId, (e) => {
		// 	console.log(
		// 		`${e.fromBroadcasterDisplayName} raided ${e.toBroadcasterDisplayName} with ${e.viewers} viewers`
		// 	);
		// 	io.emit("channelRaid", e);
		// });

		// // Example: Subscribe to channel cheer events.
		// eventSubListener.onChannelCheer(channelId, (e) => {
		// 	console.log(`${e.userName} cheered ${e.bits} bits`);
		// 	io.emit("channelCheer", e);
		// });

		// // Example: Subscribe to channel poll begin events.
		// eventSubListener.onChannelPollBegin(channelId, (e) => {
		// 	console.log(`${e.broadcasterDisplayName} started a poll: ${e.title}`);
		// 	io.emit("channelPollBegin", e);
		// });

		// // Example: Subscribe to channel prediction begin events.
		// eventSubListener.onChannelPredictionBegin(channelId, (e) => {
		// 	console.log(
		// 		`${e.broadcasterDisplayName} started a prediction: ${e.title}`
		// 	);
		// 	io.emit("channelPredictionBegin", e);
		// });

		// Add more event subscriptions as needed...

		// eventSubListener.onUserSocketConnect(() => {
		// 	console.log("WebSocket connected. ");
		// 	// setTimeout(setupTwitchEventSub, 5000); // Reconnect after 5 seconds
		// });

		// eventSubListener.onReconnectSuccess(() => {
		// 	console.log("WebSocket reconnected successfully.");
		// });

		// eventSubListener.onReconnectFailure(() => {
		// 	console.error("WebSocket reconnection failed.");
		// });

		console.log("Twitch EventSub WebSocket connected.");
	});
}

function getRedeemDetails(redeem) {
	const {
		id,
		input,
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
		input,
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
		input,
		redemptionDate,
		rewardCost,
		rewardPrompt,
		rewardTitle,
		status,
		userDisplayName,
	} = redeem;

	return new Map([
		["channelName", channelName],
		["input", input],
		["date", redemptionDate],
		["cost", rewardCost],
		["prompt", rewardPrompt],
		["name", rewardTitle],
		["status", status],
		["user", userDisplayName],
		["cost", rewardCost],
	]);
}

exports.init = init;
