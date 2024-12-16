const List = require("../../models/list.js");

async function aggregate(pipeline) {
	return await List.aggregate(pipeline).exec();
}

module.exports = aggregate;
