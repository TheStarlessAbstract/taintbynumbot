/**
 * Returns an array of strings representing the roles based on the properties of the `config` object.
 * @param {Object} config - An object containing boolean properties representing different roles.
 * @returns {Array} - An array of strings representing the roles.
 */
const configRoleStrings = (config) => {
	const roles = [];

	if (config?.isBroadcaster) roles.push("broadcaster");
	if (config?.isFounder) roles.push("founders");
	if (config?.isArtist) roles.push("artists");
	if (config?.isMod) roles.push("mods");
	if (config?.isSub) roles.push("subs");
	if (config?.isVip) roles.push("vips");

	return roles.length ? roles : ["users"];
};

module.exports = configRoleStrings;
