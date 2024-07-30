const Command = require("../../models/commandnew");

async function create(doc, options) {
	if (options) {
		return await Command.create(doc, options);
	}
	return await Command.create(doc);
}

module.exports = create;
