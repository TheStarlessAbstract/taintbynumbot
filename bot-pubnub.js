require("dotenv").config();
const PubNub = require("pubnub");

const commands = require("./bot-commands");

const pubKey = process.env.PUBNUB_PUBLISH_KEY;
const subKey = process.env.PUBNUB_SUBSCRIBE_KEY;

const pubnub = new PubNub({
	publishKey: pubKey,
	subscribeKey: subKey,
	userId: "456",
});

function setup() {
	const listener = createListener();

	pubnub.addListener(listener);

	pubnub.subscribe({
		channels: ["command_toggle"],
	});
}

function createListener() {
	return {
		status: (statusEvent) => {
			if (statusEvent.category === "PNConnectedCategory") {
				console.log("Connect");
			}
		},
		message: (messageEvent) => {
			switch (messageEvent.channel) {
				case "command_toggle":
					let message = JSON.parse(messageEvent.message.description);
					handleCommandToggle(message.command, message.version);
					break;
				default:
					console.log("This case has not been defined yet");
					break;
			}
		},
		presence: (presenceEvent) => {
			// handle presence
		},
	};
}
const handleCommandToggle = (commandName, number) => {
	commands.list[commandName].setVersionActive(number);
};

exports.setup = setup;
