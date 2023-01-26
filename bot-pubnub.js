require("dotenv").config();
const PubNub = require("pubnub");

const commands = require("./bot-commands");

const pubKey = process.env.PUBNUB_PUBKEY;
const subKey = process.env.PUBNUB_SUBKEY;

const pubnub = new PubNub({
	publishKey: pubKey,
	subscribeKey: subKey,
	userId: "456",
});

setup();

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
					handleCommandToggle(messageEvent.message.description);
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

const handleCommandToggle = (commandName) => {
	commands.list[commandName].active = !commands.list[commandName].active;
};

exports.setup = setup;
