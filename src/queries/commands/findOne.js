const Command = require("../../models/commandnew.js");

async function findOne(query, projection, options) {
	return await Command.findOne(query, projection, options).exec();
}

module.exports = { findOne };
