const PubNub = require("pubnub");

const pubKey = process.env.PUBNUB_PUBLISH_KEY;
const subKey = process.env.PUBNUB_SUBSCRIBE_KEY;

const pubnub = new PubNub({
	publishKey: pubKey,
	subscribeKey: subKey,
	userId: "123",
});

const publishMessage = async (channel, message) => {
	console.log(message);
	const publishPayload = {
		channel: channel,
		message: {
			title: "update",
			description: message,
		},
	};
	await pubnub.publish(publishPayload);
};

exports.publishMessage = publishMessage;
