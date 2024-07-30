const Command = require("../../models/commandnew");

async function deleteOne(conditions, options) {
	return await Command.deleteOne(conditions, options).exec();
}

module.exports = deleteOne;
