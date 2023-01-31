let versions = [
	{
		description: "For the glory of buhhs",
		usage: "!buhhs",
		usableBy: "users",
		active: true,
	},
];

const getCommand = () => {
	return {
		response:
			"buhhsbot is a super amazing bot made by the super amazing @asdfWENDYfdsa Go to https://www.twitch.tv/buhhsbot, and type !join in chat to have buhhsbot bootify your chat",
	};
};

function getVersions() {
	return versions;
}

function setVersionActive(element) {
	versions[element].active = !versions[element].active;
}

exports.getCommand = getCommand;
exports.getVersions = getVersions;
exports.setVersionActive = setVersionActive;
