const { chatCommandConfigMap } = require("../config");

/**
 * Retrieves the chat command configuration map from the provided config object.
 * The map is updated with values from the config object if the keys match.
 * @param {Object} config - An object containing key-value pairs representing the configuration for chat commands.
 * @returns {Map|undefined} - A map object containing the chat command configuration, or undefined if the map is not an instance of Map.
 */
const getChatCommandConfigMap = (config) => {
	if (!config) return;
	const map = chatCommandConfigMap();
	if (!(map instanceof Map)) return;

	for (const key of map.keys()) {
		if (!config.hasOwnProperty(key)) return undefined;
		map.set(key, config[key]);
	}

	return map;
};

module.exports = getChatCommandConfigMap;
