const commandTypes = require("../../config/commandTypes.js");
const types = commandTypes();

const getCommandType = (type) => {
	return types[type];
};

module.exports = getCommandType;
