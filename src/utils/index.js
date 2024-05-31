const isBroadcaster = require("./isBroadcaster.js");
const isNonEmptyMap = require("./isNonEmptyMap.js");
const processOutputString = require("./processOutputString.js");
const getUserRolesAsStrings = require("./getUserRolesAsStrings.js");
const getChatCommandConfigMap = require("./getChatCommandConfigMap.js");
const startsWithCaseInsensitive = require("./startsWithCaseInsensitive.js");
const getRandomBetweenInclusiveMax = require("./getRandomBetweenInclusiveMax.js");
const getRandomBetweenExclusiveMax = require("./getRandomBetweenExclusiveMax.js");
const modify = require("./modify");
const valueChecks = require("./valueChecks");
const messageHandler = require("./messageHandler");

module.exports = {
	modify,
	valueChecks,
	messageHandler,
	isBroadcaster,
	isNonEmptyMap,
	processOutputString,
	getUserRolesAsStrings,
	getChatCommandConfigMap,
	startsWithCaseInsensitive,
	getRandomBetweenInclusiveMax,
	getRandomBetweenExclusiveMax,
};
