const chatClient = require("../bot-chatclient");

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];
			let username;
			let user;
			let stream;
			let streamed;

			if (config.isModUp) {
				if (config.argument) {
					username = config.argument;
					if (username.startsWith("@")) {
						username = username.slice(1);
					}

					let apiClient = chatClient.getApiClient();

					user = await apiClient.users.getUserByName(username);

					if (!user) {
						result.push(["Couldn't find a user by the name of " + username]);
					} else {
						stream = await apiClient.channels.getChannelInfo(user.id);

						if (stream.gameName != "") {
							streamed = ", they last streamed " + stream.gameName;
						} else {
							streamed = "";
						}

						result.push(
							"Go check out " +
								username +
								" at twitch.tv/" +
								username +
								streamed +
								". I hear they love the Taint"
						);
					}
				} else {
					result.push([
						"You got to include a username to shoutout someone: !so buhhsbot",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!so command is for Mods only"]);
			}

			return result;
		},
		versions: [
			{
				description: "Gives a shoutout to some wonderful user",
				usage: "!so @buhhsbot",
				usableBy: "mods",
			},
		],
	};
};

exports.getCommand = getCommand;
