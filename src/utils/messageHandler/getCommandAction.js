const commandTypes = require("../../config/commandTypes.js");
const types = commandTypes();

const getCommandAction = (type) => {
	return types[type];
};

module.exports = getCommandAction;
