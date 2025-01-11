const Command = require("../../models/commandnew");

async function find(filter, projection, options) {
	return Command.find(filter, projection, options);
}

module.exports = find;
