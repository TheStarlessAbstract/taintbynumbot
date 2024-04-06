const configRoleStrings = (config) => {
	let array = [];

	if (config.isBroadcaster) array.push("broadcaster");
	if (config.isMod) array.push("mods");
	if (config.isSub) array.push("subs");
	if (config.isFounder) array.push("founders");
	if (config.isArtist) array.push("artists");
	if (config.isVip) array.push("vips");

	if (array.length == 0) array.push("users");
	console.log(array);

	return array;
};

module.exports = configRoleStrings;
