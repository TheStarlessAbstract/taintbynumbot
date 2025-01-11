// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const discordChannelId = process.env.DISCORD_CHANNEL;
const token = process.env.DISCORD_TOKEN;
let client;

// Create a new client instance
client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

async function login(loginEvent) {
	// When the client is ready, run this code (only once).
	// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
	// It makes some properties non-nullable.
	client.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
		loginEvent.emit("login");
	});

	// Log in to Discord with your client's token
	await client.login(token);
}

function getClient() {
	return client;
}

exports.login = login;
exports.getClient = getClient;
