require("dotenv").config();
const PubNub = require("pubnub");

const pubnub = new PubNub({
	publishKey: process.env.PUBNUB_PUBKEY,
	subscribeKey: process.env.PUBNUB_SUBKEY,
	userId: "456",
});

// add listener
const listener = {
	status: (statusEvent) => {
		if (statusEvent.category === "PNConnectedCategory") {
			console.log("Connect");
		}
	},
	message: (messageEvent) => {
		showMessage(messageEvent.message.description);
	},
	presence: (presenceEvent) => {
		// handle presence
	},
};

pubnub.addListener(listener);

// subscribe to a channel
pubnub.subscribe({
	channels: ["hello_world"],
});

const showMessage = (msg) => {
	let test = JSON.parse(msg);

	console.log(test);
};
