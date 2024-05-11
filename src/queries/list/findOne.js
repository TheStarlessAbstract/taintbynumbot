const List = require("../../models/list.js");

async function findOne(query, projection, options) {
	return await List.findOne(query, projection, options).exec();
}

module.exports = findOne;
