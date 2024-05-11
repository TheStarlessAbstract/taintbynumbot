const Tinder = require("../../models/tinder.js");
const List = require("../models/list.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

async function copyAndUpdate() {
	let tinders = await Tinder.find();

	let list = [];
	for (let i = 0; i < tinders.length; i++) {
		list.push({
			channelId: twitchId,
			name: "tinder",
			index: tinders[i].index,
			text: tinders[i].text,
			createdBy: tinders[i].addedBy,
			createdOn: new Date(),
		});
	}
	await List.insertMany(list);
}

module.exports = copyAndUpdate;
