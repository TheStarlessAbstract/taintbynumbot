let versions = [
	{
		description:
			"Let the stream know you are going to lurk for a while...please come back",
		usage: "!lurk",
		usableBy: "users",
		active: true,
	},
];

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];

			result.push(
				config.userInfo.displayName +
					" finds a comfortable spot behind the bushes to perv on the stream"
			);

			return result;
		},
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
