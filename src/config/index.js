const { chatCommandConfigMap } = require("./chatCommandConfigMap");
const { getCommandType } = require("./commandTypes");
const { getCommandAction } = require("./commandActions");
const { getRedemptionType } = require("./redemptionTypes");

module.exports = {
	chatCommandConfigMap,
	getCommandType,
	getCommandAction,
	getRedemptionType,
};
