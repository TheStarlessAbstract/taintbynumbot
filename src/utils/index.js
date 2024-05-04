const isBroadcaster = require("./isBroadcaster.js");
const isNonEmptyMap = require("./isNonEmptyMap.js");
const isNonEmptyString = require("./isNonEmptyString.js");
const processOutputString = require("./processOutputString.js");
const getUserRolesAsStrings = require("./getUserRolesAsStrings.js");
const getChatCommandConfigMap = require("./getChatCommandConfigMap.js");
const startsWithCaseInsensitive = require("./startsWithCaseInsensitive.js");
const getRandomBetweenInclusiveMax = require("./getRandomBetweenInclusiveMax.js");
const inputCheck = require("./inputCheck");
const messageHandler = require("./messageHandler");

module.exports = {
	inputCheck,
	messageHandler,
	isBroadcaster,
	isNonEmptyMap,
	isNonEmptyString,
	processOutputString,
	getUserRolesAsStrings,
	getChatCommandConfigMap,
	startsWithCaseInsensitive,
	getRandomBetweenInclusiveMax,
};
