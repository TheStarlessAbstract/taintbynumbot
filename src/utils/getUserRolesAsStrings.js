/**
 * This function takes an object as input with boolean properties representing different user roles.
 * It returns an array of strings representing the user roles that are true.
 *
 * @param {Object} userRoles - An object with boolean properties representing user roles.
 * @returns {Array} - An array of strings representing the user roles that are true.
 */
const getUserRolesAsStrings = ({
	isBroadcaster,
	isFounder,
	isArtist,
	isMod,
	isSub,
	isVip,
}) => {
	const roles = [];

	if (isBroadcaster) roles.push("broadcaster");
	if (isFounder) roles.push("founders");
	if (isArtist) roles.push("artists");
	if (isMod) roles.push("mods");
	if (isSub) roles.push("subs");
	if (isVip) roles.push("vips");

	return roles.length ? roles : ["viewers"];
};

module.exports = getUserRolesAsStrings;
