const isBroadcaster = require("./isBroadcaster.js");
const isValueNumber = require("./isValueNumber.js");
const isNonEmptyMap = require("./isNonEmptyMap.js");
const isNonEmptyString = require("./isNonEmptyString.js");
const processOutputString = require("./processOutputString.js");
const getCommandAction = require("./getCommandAction.js");
const getUserRolesAsStrings = require("./getUserRolesAsStrings.js");
const getChatCommandConfigMap = require("./getChatCommandConfigMap.js");
const startsWithCaseInsensitive = require("./startsWithCaseInsensitive.js");
const getRandomBetweenInclusiveMax = require("./getRandomBetweenInclusiveMax.js");

module.exports = {
	isBroadcaster,
	isValueNumber,
	isNonEmptyMap,
	isNonEmptyString,
	processOutputString,
	getCommandAction,
	getUserRolesAsStrings,
	getChatCommandConfigMap,
	startsWithCaseInsensitive,
	getRandomBetweenInclusiveMax,
};
