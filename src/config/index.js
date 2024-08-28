const { chatCommandConfigMap } = require("./chatCommandConfigMap.js");
const { getCommandType } = require("./commandTypes");
const { getCommandAction } = require("./commandActions");

module.exports = {
	chatCommandConfigMap,
	getCommandType,
	getCommandAction,
};
