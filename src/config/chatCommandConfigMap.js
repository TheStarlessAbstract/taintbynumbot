/**
 * Returns a new Map object with default configuration properties.
 * @returns {Map} The Map object with default configuration properties.
 */
const chatCommandConfigMap = () => {
	// Create a new Map object and initialize it with default configuration properties
	return new Map([
		["channelName", ""],
		["displayName", ""],
		["gameName", ""],
		["channelId", ""],
		["isBroadcaster", ""],
		["title", ""],
	]);
};

module.exports = chatCommandConfigMap;
