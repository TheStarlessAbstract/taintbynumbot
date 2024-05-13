const List = require("../../models/list.js");

async function deleteOne(conditions, options) {
	return await List.deleteOne(conditions, options).exec();
}

module.exports = deleteOne;
