require("dotenv").config();
const PubNub = require("pubnub");

const pubKey = process.env.PUBNUB_PUBKEY;
const subKey = process.env.PUBNUB_SUBKEY;

const pubnub = new PubNub({
	publishKey: pubKey,
	subscribeKey: subKey,
	userId: "123",
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

// publish message
const publishMessage = async (message) => {
	// With the right payload, you can publish a message, add a reaction to a message,
	// send a push notification, or send a small payload called a signal.
	const publishPayload = {
		channel: "hello_world",
		message: {
			title: "greeting",
			description: message,
		},
	};
	await pubnub.publish(publishPayload);
};

// subscribe to a channel
pubnub.subscribe({
	channels: ["hello_world"],
});

// built-in package for reading from stdin
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.setPrompt("");
readline.prompt();

// publish after hitting return
readline.on("line", (message) => {
	publishMessage(message).then(() => {
		readline.prompt();
	});
});

const showMessage = (msg) => {
	console.log("message: " + msg);
};
