const List = require("../../models/list.js");

async function aggregate(pipline) {
	return await List.aggregate(pipline).exec();
}

module.exports = aggregate;
