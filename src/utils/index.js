const diceRoll = require("./diceRoll.js");
const isBroadcaster = require("./isBroadcaster.js");
const isValueNumber = require("./isValueNumber.js");
const configRoleStrings = require("./configRoleStrings.js");
const processOutputString = require("./processOutputString.js");
const getChatCommandConfigMap = require("./getChatCommandConfigMap.js");
const getProcessedOutputString = require("./getProcessedOutputString.js");

module.exports = {
	diceRoll,
	isBroadcaster,
	isValueNumber,
	configRoleStrings,
	processOutputString,
	getChatCommandConfigMap,
	getProcessedOutputString,
};
