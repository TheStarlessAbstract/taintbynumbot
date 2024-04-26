const isBroadcaster = require("./isBroadcaster.js");
const isValueNumber = require("./isValueNumber.js");
const isNonEmptyMap = require("./isNonEmptyMap.js");
const isNonEmptyString = require("./isNonEmptyString.js");
const getUserRolesAsStrings = require("./getUserRolesAsStrings.js");
const processOutputString = require("./processOutputString.js");
const getChatCommandConfigMap = require("./getChatCommandConfigMap.js");
const getProcessedOutputString = require("./getProcessedOutputString.js");
const getRandomBetweenInclusiveMax = require("./getRandomBetweenInclusiveMax.js");

module.exports = {
	isBroadcaster,
	isValueNumber,
	isNonEmptyMap,
	isNonEmptyString,
	getUserRolesAsStrings,
	processOutputString,
	getChatCommandConfigMap,
	getProcessedOutputString,
	getRandomBetweenInclusiveMax,
};
