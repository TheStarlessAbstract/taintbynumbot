const configRoleStrings = (config) => {
	let array = [];

	if (config.isBroadcaster) array.push("isBroadcaster");
	if (config.isMod) array.push("isMod");
	if (config.isSub) array.push("isSub");
	if (config.isFounder) array.push("isFounder");
	if (config.isArtist) array.push("isArtist");
	if (config.isVip) array.push("isVip");

	if (array.length == 0) array.push("isUser");

	return array;
};

module.exports = configRoleStrings;
