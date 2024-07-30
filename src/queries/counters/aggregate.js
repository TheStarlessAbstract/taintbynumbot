const Counter = require("../../models/counter.js");

async function aggregate(pipline) {
	return await Counter.aggregate(pipline);
}

module.exports = aggregate;
