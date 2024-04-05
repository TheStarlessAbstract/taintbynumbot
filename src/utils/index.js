const getProcessedOutputString = require("./getProcessedOutputString.js");
const isBroadcaster = require("./isBroadcaster.js");
const isCooldownPassed = require("./isCooldownPassed.js");
const getChatCommandConfigMap = require("./getCommandConfigMap.js");
const configRoleStrings = require("./configRoleStrings.js");
// const confirmChannelProperties = require("./confirmChannelProperties.js");
const isValueNumber = require("./isValueNumber.js");

module.exports = {
	getChatCommandConfigMap,
	getProcessedOutputString,
	isBroadcaster,
	isCooldownPassed,
	configRoleStrings,
	// confirmChannelProperties,
	isValueNumber,
};
