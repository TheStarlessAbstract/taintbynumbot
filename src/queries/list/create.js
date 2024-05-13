const List = require("../../models/list.js");

async function create(doc, options) {
	if (options) {
		return await List.create(doc, options);
	}
	return await List.create(doc);
}

module.exports = create;
