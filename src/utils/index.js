const getProcessedOutputString = require("./getProcessedOutputString.js");
const isBroadcaster = require("./isBroadcaster.js");
const isCooldownPassed = require("./isCooldownPassed.js");
const getChatCommandConfigMap = require("./getCommandConfigMap.js");

module.exports = {
	getChatCommandConfigMap,
	getProcessedOutputString,
	isBroadcaster,
	isCooldownPassed,
};
