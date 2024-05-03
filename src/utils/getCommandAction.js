const { commandTypes } = require("../config");
const types = commandTypes();

const getCommandAction = (type) => {
	return types[type];
};

module.exports = getCommandAction;
