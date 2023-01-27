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
		versions: [
			{
				description:
					"Let the stream know you are going to lurk for a while...please come back",
				usage: "!lurk",
				usableBy: "users",
			},
		],
	};
};

exports.getCommand = getCommand;
