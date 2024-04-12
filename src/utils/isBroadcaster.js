/**
 * Returns the value of the `isBroadcaster` property from the `config` object.
 * @param {object} config - The configuration object that contains the `isBroadcaster` property.
 * @returns {boolean} - The value of the `isBroadcaster` property.
 */
const isBroadcaster = (config) => {
	if (typeof config?.isBroadcaster !== "boolean") return false;

	return config.isBroadcaster;
};

module.exports = isBroadcaster;
