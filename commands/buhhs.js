const getCommand = () => {
	return {
		response:
			"buhhsbot is a super amazing bot made by the super amazing @asdfWENDYfdsa. Go to https://www.twitch.tv/buhhsbot, and type !join in chat to have buhhsbot bootify your chat",
		versions: [
			{
				description: "For the glory of buhhs",
				usage: "!buhhs",
				usableBy: "users",
			},
		],
	};
};

exports.getCommand = getCommand;
