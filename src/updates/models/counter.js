const DeathCounter = require("../../../models/deathcounter");
const Counter = require("../../models/counter");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

async function copyAndUpdate() {
	let deathCounters = await DeathCounter.find();

	let counters = [];

	for (let i = 0; i < deathCounters.length; i++) {
		counters.push({
			channelId: twitchId,
			name: "deaths",
			gameTitle: deathCounters[i].gameTitle,
			streamStartDate: deathCounters[i].streamStartDate,
			count: deathCounters[i].deaths,
		});
	}

	await Counter.insertMany(counters);
}

module.exports = copyAndUpdate;
